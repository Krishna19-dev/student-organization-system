const prisma = require('../../lib/prisma');

exports.getSummary = async (req, res, next) => {
  try {
    const income = await prisma.ledgerEntry.aggregate({
      where: { type: 'INCOME' },
      _sum: { amount: true }
    });
    const expenses = await prisma.ledgerEntry.aggregate({
      where: { type: 'EXPENSE' },
      _sum: { amount: true }
    });
    
    const totalIncome = income._sum.amount || 0;
    const totalExpenses = expenses._sum.amount || 0;
    
    res.json({
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses
    });
  } catch (error) { next(error); }
};

exports.getBreakdown = async (req, res, next) => {
  try {
    const entries = await prisma.ledgerEntry.groupBy({
      by: ['category'],
      where: { type: 'INCOME' },
      _sum: { amount: true }
    });
    res.json(entries);
  } catch (error) { next(error); }
};

exports.getEventPnL = async (req, res, next) => {
  try {
    const { id } = req.params;
    const entries = await prisma.ledgerEntry.groupBy({
      by: ['type'],
      where: { eventId: id },
      _sum: { amount: true }
    });
    res.json(entries);
  } catch (error) { next(error); }
};

exports.getLedger = async (req, res, next) => {
  try {
    const ledger = await prisma.ledgerEntry.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(ledger);
  } catch (error) { next(error); }
};
