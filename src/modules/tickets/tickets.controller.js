const prisma = require('../../lib/prisma');
const crypto = require('crypto');

exports.verifyPayment = async (req, res, next) => {
  try {
    const { paymentId, signature } = req.body;
    
    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment || payment.status === 'PAID') return res.json({ message: 'Already paid' });
    
    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: paymentId },
        data: { status: 'PAID', signature }
      });

      const qrToken = crypto.randomBytes(16).toString('hex');

      await tx.ticket.create({
        data: {
          eventId: payment.eventId, // Assumes we tracked eventId or parsed it
          userId: payment.userId,
          paymentId: payment.id,
          qrToken
        }
      });

      await tx.ledgerEntry.create({
        data: {
          type: 'INCOME',
          category: 'TICKETS',
          amount: payment.amount,
          paymentId: payment.id
        }
      });
    });

    res.json({ message: 'Payment verified, ticket issued' });
  } catch (error) { next(error); }
};

exports.getMyTickets = async (req, res, next) => {
  try {
    const tickets = await prisma.ticket.findMany({ where: { userId: req.user.id }, include: { event: true } });
    res.json(tickets);
  } catch (error) { next(error); }
};

exports.checkin = async (req, res, next) => {
  try {
    const { qrToken } = req.body;
    const ticket = await prisma.ticket.findUnique({ where: { qrToken } });
    
    if (!ticket) return res.status(404).json({ error: { message: 'Invalid ticket' } });
    if (ticket.status === 'USED') return res.status(400).json({ error: { message: 'Already used' } });

    await prisma.ticket.update({
      where: { qrToken },
      data: { status: 'USED' }
    });

    res.json({ message: 'Valid' });
  } catch (error) { next(error); }
};
