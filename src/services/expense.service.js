const prisma = require('../lib/prisma');

async function getPendingExpenses() {
  return await prisma.expenseClaim.findMany({
    where: { status: 'PENDING' },
    include: { user: true, event: true },
    orderBy: { createdAt: 'asc' }
  });
}

async function getEventExpenses(eventId) {
  return await prisma.expenseClaim.findMany({
    where: { eventId, status: 'PAID' },
    include: { user: true }
  });
}

module.exports = { getPendingExpenses, getEventExpenses };
