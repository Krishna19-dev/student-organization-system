const prisma = require('../../lib/prisma');
const { badRequest, notFound, conflict } = require('../../lib/errors');
const { resolveTicketPrice } = require('../../services/pricing.service');
const paymentService = require('../../services/payment.service');
const ticketService = require('../../services/ticket.service');
const asyncHandler = require('../../lib/asyncHandler');

exports.listEvents = asyncHandler(async (req, res) => {
  const events = await prisma.event.findMany({
    orderBy: { date: 'asc' },
  });

  const formatted = events.map((e) => ({
    ...e,
    seatsLeft: Math.max(0, e.totalSeats - e.seatsSold),
  }));

  res.json(formatted);
});

exports.getEvent = asyncHandler(async (req, res) => {
  const event = await prisma.event.findUnique({
    where: { id: req.params.id },
  });

  if (!event) throw notFound('EVENT_NOT_FOUND', 'Event not found');

  res.json({
    ...event,
    seatsLeft: Math.max(0, event.totalSeats - event.seatsSold),
  });
});

exports.createEvent = asyncHandler(async (req, res) => {
  const { title, venue, date, startsAt, totalSeats, memberPrice, guestPrice } = req.body;

  const eventDate = new Date(startsAt || date);
  const seats = parseInt(totalSeats, 10);
  const mPrice = parseInt(memberPrice, 10);
  const gPrice = parseInt(guestPrice, 10);

  if (!title || !venue || isNaN(eventDate.getTime())) {
    throw badRequest('VALIDATION_ERROR', 'Title, venue, and a valid date are required');
  }

  if (isNaN(seats) || seats < 1) {
    throw badRequest('INVALID_SEATS', 'Total seats must be at least 1');
  }

  if (isNaN(mPrice) || mPrice < 0 || isNaN(gPrice) || gPrice < 0) {
    throw badRequest('INVALID_PRICE', 'Prices must be non-negative integers in paise');
  }

  const event = await prisma.event.create({
    data: {
      title,
      venue,
      date: eventDate,
      totalSeats: seats,
      seatsSold: 0,
      memberPrice: mPrice,
      guestPrice: gPrice,
    },
  });

  res.status(201).json(event);
});

exports.updateEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) throw notFound('EVENT_NOT_FOUND', 'Event not found');

  const { title, venue, date, startsAt, totalSeats, memberPrice, guestPrice } = req.body;
  const updateData = {};

  if (title) updateData.title = title;
  if (venue) updateData.venue = venue;
  if (date || startsAt) updateData.date = new Date(startsAt || date);
  if (memberPrice !== undefined) updateData.memberPrice = parseInt(memberPrice, 10);
  if (guestPrice !== undefined) updateData.guestPrice = parseInt(guestPrice, 10);

  if (totalSeats !== undefined) {
    const seats = parseInt(totalSeats, 10);
    if (seats < existing.seatsSold) {
      throw badRequest(
        'INVALID_SEAT_COUNT',
        `Cannot lower total seats (${seats}) below currently sold seats (${existing.seatsSold})`
      );
    }
    updateData.totalSeats = seats;
  }

  const updated = await prisma.event.update({
    where: { id },
    data: updateData,
  });

  res.json(updated);
});

exports.eventReport = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      tickets: true,
      ledgerEntries: true,
    },
  });

  if (!event) throw notFound('EVENT_NOT_FOUND', 'Event not found');

  const sold = event.seatsSold;
  const attended = event.tickets.filter((t) => t.status === 'USED').length;
  const noShows = Math.max(0, sold - attended);

  let revenue = 0;
  let expenses = 0;

  for (const entry of event.ledgerEntries) {
    if (entry.type === 'INCOME' && entry.category === 'TICKETS') {
      revenue += entry.amount;
    } else if (entry.type === 'EXPENSE') {
      expenses += entry.amount;
    }
  }

  const net = revenue - expenses;

  res.json({
    eventId: event.id,
    title: event.title,
    sold,
    attended,
    noShows,
    revenue,
    expenses,
    net,
  });
});

exports.checkout = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { quantity, buyerName, buyerEmail } = req.body;
  const qty = parseInt(quantity, 10) || 1;

  if (qty < 1 || qty > 10) {
    throw badRequest('INVALID_QUANTITY', 'Ticket quantity must be between 1 and 10');
  }

  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) throw notFound('EVENT_NOT_FOUND', 'Event not found');

  const seatsLeft = event.totalSeats - event.seatsSold;
  if (seatsLeft < qty) {
    throw conflict(
      'SOLD_OUT',
      seatsLeft <= 0 ? 'Sold out' : `Only ${seatsLeft} seat${seatsLeft > 1 ? 's' : ''} left`
    );
  }

  const userId = req.user?.id || null;
  const { unitPrice, isMemberPrice } = await resolveTicketPrice(userId, event);
  const total = unitPrice * qty;

  // Free event
  if (total === 0) {
    // If guest, create or find anonymous user or require user
    let buyerId = userId;
    if (!buyerId) {
      if (!buyerEmail) throw badRequest('EMAIL_REQUIRED', 'Email required for ticket issuance');
      let guestUser = await prisma.user.findUnique({ where: { email: buyerEmail } });
      if (!guestUser) {
        guestUser = await prisma.user.create({
          data: {
            email: buyerEmail,
            name: buyerName || 'Guest Attendee',
            password: 'mock_password_hash',
          },
        });
      }
      buyerId = guestUser.id;
    }

    const result = await prisma.$transaction(async (tx) => {
      const reserved = await ticketService.reserveSeats(tx, event.id, qty);
      if (!reserved) throw conflict('SOLD_OUT', 'Seats sold out');

      // Create free payment record
      const freePayment = await tx.payment.create({
        data: {
          userId: buyerId,
          amount: 0,
          purpose: 'TICKETS',
          status: 'PAID',
        },
      });

      const tickets = await ticketService.issueTickets(tx, {
        eventId: event.id,
        userId: buyerId,
        paymentId: freePayment.id,
        quantity: qty,
      });

      return { tickets };
    });

    return res.json({
      free: true,
      tickets: result.tickets,
    });
  }

  // Paid event
  let buyerId = userId;
  if (!buyerId) {
    if (!buyerEmail) throw badRequest('EMAIL_REQUIRED', 'Email required for checkout');
    let guestUser = await prisma.user.findUnique({ where: { email: buyerEmail } });
    if (!guestUser) {
      guestUser = await prisma.user.create({
        data: {
          email: buyerEmail,
          name: buyerName || 'Guest Attendee',
          password: 'mock_password_hash',
        },
      });
    }
    buyerId = guestUser.id;
  }

  const order = await paymentService.createOrder({
    purpose: 'TICKETS',
    amount: total,
    userId: buyerId,
    meta: {
      eventId: event.id,
      quantity: qty,
      buyerName: buyerName || req.user?.name,
      buyerEmail: buyerEmail || req.user?.email,
      unitPrice,
      isMemberPrice,
    },
  });

  res.json({
    ...order,
    unitPrice,
    quantity: qty,
    isMemberPrice,
  });
});
