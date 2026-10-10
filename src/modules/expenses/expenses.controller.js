const prisma = require('../../lib/prisma');

exports.submitExpense = async (req, res, next) => {
  try {
    const { amount, description, eventId } = req.body;
    const receiptUrl = req.file ? req.file.filename : null;

    const claim = await prisma.expenseClaim.create({
      data: {
        userId: req.user.id,
        amount: parseInt(amount, 10),
        description,
        eventId: eventId || null,
        receiptUrl
      }
    });
    res.status(201).json(claim);
  } catch (error) { next(error); }
};

exports.getMyExpenses = async (req, res, next) => {
  try {
    const claims = await prisma.expenseClaim.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(claims);
  } catch (error) { next(error); }
};

exports.getQueue = async (req, res, next) => {
  try {
    const claims = await prisma.expenseClaim.findMany({
      where: { status: 'PENDING' },
      include: { user: true }
    });
    res.json(claims);
  } catch (error) { next(error); }
};

exports.approveExpense = async (req, res, next) => {
  try {
    const claim = await prisma.expenseClaim.update({
      where: { id: req.params.id },
      data: { status: 'APPROVED' }
    });
    res.json(claim);
  } catch (error) { next(error); }
};

exports.rejectExpense = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const claim = await prisma.expenseClaim.update({
      where: { id: req.params.id },
      data: { status: 'REJECTED', reason }
    });
    res.json(claim);
  } catch (error) { next(error); }
};

exports.payExpense = async (req, res, next) => {
  try {
    const claimId = req.params.id;
    const claim = await prisma.expenseClaim.findUnique({ where: { id: claimId } });
    if (!claim || claim.status !== 'APPROVED') {
      return res.status(400).json({ error: { message: 'Claim not found or not approved' } });
    }

    await prisma.$transaction(async (tx) => {
      await tx.expenseClaim.update({
        where: { id: claimId },
        data: { status: 'PAID' }
      });

      await tx.ledgerEntry.create({
        data: {
          type: 'EXPENSE',
          category: 'EXPENSE',
          amount: claim.amount,
          description: claim.description,
          expenseClaimId: claim.id,
          eventId: claim.eventId,
          createdById: req.user.id
        }
      });
    });

    res.json({ message: 'Claim paid and recorded in ledger' });
  } catch (error) { next(error); }
};
