const prisma = require('../lib/prisma');

async function getOverdueDeliverables() {
  return await prisma.deliverable.findMany({
    where: {
      status: { not: 'DONE' },
      dueDate: { lt: new Date() }
    },
    include: { sponsor: true, task: true },
    orderBy: { dueDate: 'asc' }
  });
}

async function recordInKindContribution(sponsorId, amountEst, description, eventId = null) {
  // In-kind contributions DO NOT touch the LedgerEntry
  return await prisma.contribution.create({
    data: {
      sponsorId,
      isCash: false,
      amount: amountEst,
      description,
      eventId
    }
  });
}

module.exports = { getOverdueDeliverables, recordInKindContribution };
