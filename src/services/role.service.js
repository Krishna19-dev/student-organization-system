const prisma = require('../lib/prisma');

async function getEffectiveRole(userId) {
  const activeAssignments = await prisma.roleAssignment.findMany({
    where: {
      userId,
      startDate: { lte: new Date() },
      OR: [
        { endDate: null },
        { endDate: { gt: new Date() } }
      ]
    }
  });

  const rolePriority = {
    'PRESIDENT': 5,
    'TREASURER': 4,
    'VP_EVENTS': 3,
    'VOLUNTEER': 2
  };

  let topRole = null;
  let topPriority = 0;
  let positionTitle = null;

  for (const assignment of activeAssignments) {
    const priority = rolePriority[assignment.role] || 0;
    if (priority > topPriority) {
      topPriority = priority;
      topRole = assignment.role;
      positionTitle = assignment.positionTitle;
    }
  }

  if (topRole) {
    return { role: topRole, positionTitle };
  }

  const activeMembership = await prisma.membership.findFirst({
    where: {
      userId,
      status: 'ACTIVE',
      expiryDate: { gt: new Date() }
    }
  });

  if (activeMembership) {
    return { role: 'MEMBER', positionTitle: null };
  }

  const latestApplication = await prisma.application.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });

  if (latestApplication) {
    if (latestApplication.status === 'PAYMENT_PENDING') return { role: 'AWAITING_PAYMENT', positionTitle: null };
    if (latestApplication.status === 'UNDER_REVIEW') return { role: 'UNDER_REVIEW', positionTitle: null };
    if (latestApplication.status === 'REJECTED') return { role: 'REJECTED', positionTitle: null };
  }

  return { role: 'GUEST', positionTitle: null };
}

module.exports = { getEffectiveRole };
