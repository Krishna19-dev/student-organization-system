const defaultPrisma = require('../lib/prisma');
const { generateToken, toDataUrl } = require('../lib/qr');
const { conflict, notFound, badRequest } = require('../lib/errors');
const ledgerService = require('./ledger.service');

async function reserveSeats(tx, eventId, qty) {
  const client = tx || defaultPrisma;
  const rows = await client.$executeRaw`
    UPDATE "Event"
    SET "seatsSold" = "seatsSold" + ${qty}
    WHERE id = ${eventId} AND "seatsSold" + ${qty} <= "totalSeats"
  `;
  return rows > 0;
}

async function issueTickets(tx, { eventId, userId, paymentId, quantity }) {
  const client = tx || defaultPrisma;
  const tickets = [];

  for (let i = 0; i < quantity; i++) {
    const qrToken = generateToken();
    const ticket = await client.ticket.create({
      data: {
        eventId,
        userId,
        paymentId,
        qrToken,
        status: 'VALID',
      },
      include: {
        event: true,
      },
    });
    tickets.push(ticket);
  }

  return tickets;
}

async function checkInTicket(qrToken) {
  if (!qrToken) throw badRequest('INVALID_TOKEN', 'QR token is required');

  const updateResult = await defaultPrisma.ticket.updateMany({
    where: { qrToken, status: 'VALID' },
    data: { status: 'USED' },
  });

  if (updateResult.count === 1) {
    const ticket = await defaultPrisma.ticket.findUnique({
      where: { qrToken },
      include: {
        event: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });
    return { result: 'VALID', ticket };
  }

  const existing = await defaultPrisma.ticket.findUnique({
    where: { qrToken },
    include: {
      event: true,
      user: { select: { id: true, name: true, email: true } },
    },
  });

  if (!existing) {
    return { result: 'INVALID', ticket: null };
  }

  return {
    result: 'ALREADY_USED',
    ticket: existing,
  };
}

async function getMyTickets(userId) {
  const tickets = await defaultPrisma.ticket.findMany({
    where: { userId },
    include: { event: true },
    orderBy: { createdAt: 'desc' },
  });

  const ticketsWithQr = await Promise.all(
    tickets.map(async (t) => {
      const qrDataUrl = await toDataUrl(t.qrToken);
      return {
        ...t,
        qrDataUrl,
      };
    })
  );

  return ticketsWithQr;
}

module.exports = {
  reserveSeats,
  issueTickets,
  checkInTicket,
  getMyTickets,
};
