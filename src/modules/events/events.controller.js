const prisma = require('../../lib/prisma');
const { getPrice } = require('../../services/pricing.service');
const { reserveSeats } = require('../../services/ticket.service');

exports.listEvents = async (req, res, next) => {
  try {
    const events = await prisma.event.findMany();
    // compute seats left
    const response = events.map(e => ({
      ...e,
      seatsLeft: e.totalSeats - e.seatsSold
    }));
    res.json(response);
  } catch (error) { next(error); }
};

exports.getEvent = async (req, res, next) => {
  try {
    const event = await prisma.event.findUnique({ where: { id: req.params.id } });
    if (!event) return res.status(404).json({ error: { message: 'Not found' } });
    res.json({ ...event, seatsLeft: event.totalSeats - event.seatsSold });
  } catch (error) { next(error); }
};

exports.createEvent = async (req, res, next) => {
  try {
    const { title, venue, date, totalSeats, memberPrice, guestPrice } = req.body;
    const event = await prisma.event.create({
      data: { title, venue, date: new Date(date), totalSeats, memberPrice, guestPrice }
    });
    res.status(201).json(event);
  } catch (error) { next(error); }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const event = await prisma.event.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(event);
  } catch (error) { next(error); }
};

exports.checkoutTicket = async (req, res, next) => {
  try {
    const { id } = req.params; // event id
    const { qty } = req.body;
    
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return res.status(404).json({ error: { message: 'Not found' } });

    // 1. Reserve seats atomically
    const reserved = await reserveSeats(id, qty);
    if (!reserved) {
      return res.status(409).json({ error: { code: 'SOLD_OUT', message: 'Not enough seats left' } });
    }

    // 2. Resolve price server-side
    const { price } = await getPrice(req.user?.id, event);
    const amount = price * qty;

    // 3. Create payment order
    const payment = await prisma.payment.create({
      data: {
        userId: req.user.id,
        amount,
        purpose: 'TICKETS',
        orderId: 'mock_order_' + Date.now()
      }
    });

    res.json({ paymentId: payment.id, amount, message: 'Seats reserved, please verify payment' });
  } catch (error) { next(error); }
};

exports.getReport = async (req, res, next) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: {
        tickets: true,
        expenseClaims: { where: { status: 'PAID' } },
        ledgerEntries: true
      }
    });
    if (!event) return res.status(404).json({ error: { message: 'Not found' } });
    
    // Aggregation logic...
    res.json({ message: 'Event report', data: event });
  } catch (error) { next(error); }
};
