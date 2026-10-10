const prisma = require('../lib/prisma');

async function isMembershipActive(userId) {
  const membership = await prisma.membership.findFirst({
    where: {
      userId,
      status: 'ACTIVE',
      expiryDate: { gt: new Date() }
    }
  });
  return !!membership;
}

async function getExpiringMemberships(days = 30) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return await prisma.membership.findMany({
    where: {
      status: 'ACTIVE',
      expiryDate: {
        gte: new Date(),
        lte: futureDate
      }
    },
    include: { user: true },
    orderBy: { expiryDate: 'asc' }
  });
}

module.exports = { isMembershipActive, getExpiringMemberships };
