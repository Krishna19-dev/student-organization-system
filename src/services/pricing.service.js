const prisma = require('../lib/prisma');

async function getPrice(userId, event) {
  if (!userId) return { price: event.guestPrice, isMember: false };

  const membership = await prisma.membership.findFirst({
    where: {
      userId,
      status: 'ACTIVE',
      expiryDate: { gt: new Date() }
    },
    include: { membershipPlan: true }
  });

  if (membership) {
    return { price: event.memberPrice, isMember: true, discount: membership.membershipPlan.merchDiscount };
  }

  return { price: event.guestPrice, isMember: false };
}

module.exports = { getPrice };
