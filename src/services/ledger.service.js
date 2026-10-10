const prisma = require('../lib/prisma');

async function createIncomeEntry(data) {
  // data: { amount, category, paymentId?, contributionId?, fundraiserId?, createdById?, eventId? }
  return await prisma.ledgerEntry.create({
    data: {
      type: 'INCOME',
      ...data
    }
  });
}

async function createExpenseEntry(data) {
  // data: { amount, category, expenseClaimId?, paymentId?, description?, eventId? }
  return await prisma.ledgerEntry.create({
    data: {
      type: 'EXPENSE',
      ...data
    }
  });
}

module.exports = { createIncomeEntry, createExpenseEntry };
