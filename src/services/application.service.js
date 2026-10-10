const prisma = require('../lib/prisma');

async function getApplicationQueue() {
  return await prisma.application.findMany({
    where: { status: 'UNDER_REVIEW' },
    include: { user: true, payment: true },
    orderBy: { submittedAt: 'asc' }
  });
}

async function markApplicationPaymentPending(userId, tier, desiredPosition = 'NONE') {
  return await prisma.application.create({
    data: {
      userId,
      type: desiredPosition === 'NONE' ? 'MEMBER' : 'LEAD',
      desiredPosition,
      tier,
      skills: '',
      status: 'PAYMENT_PENDING'
    }
  });
}

module.exports = { getApplicationQueue, markApplicationPaymentPending };
