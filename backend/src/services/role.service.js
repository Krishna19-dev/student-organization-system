const prisma = require('../lib/prisma');
const { badRequest } = require('../lib/errors');

async function getEffectiveRole(userId) {
  if (!userId) {
    return { role: 'GUEST', status: 'NONE', positionTitle: null };
  }

  const now = new Date();
  const assignments = await prisma.roleAssignment.findMany({
    where: {
      userId,
      startDate: { lte: now },
      OR: [{ endDate: null }, { endDate: { gt: now } }],
    },
  });

  const order = ['PRESIDENT', 'TREASURER', 'VOLUNTEER'];
  const top = order.find((r) => assignments.some((a) => a.role === r));
  if (top) {
    const a = assignments.find((x) => x.role === top);
    return { role: top, positionTitle: a?.positionTitle || null, status: 'ACTIVE' };
  }

  const membership = await prisma.membership.findFirst({
    where: { userId, status: 'ACTIVE', expiryDate: { gt: now } },
  });
  if (membership) {
    return { role: 'MEMBER', positionTitle: null, status: 'ACTIVE', membershipId: membership.id };
  }

  const app = await prisma.application.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  if (app?.status === 'PAYMENT_PENDING') {
    return { role: 'GUEST', status: 'AWAITING_PAYMENT', applicationId: app.id, positionTitle: null };
  }
  if (app?.status === 'UNDER_REVIEW') {
    return { role: 'GUEST', status: 'UNDER_REVIEW', applicationId: app.id, positionTitle: null };
  }
  if (app?.status === 'REJECTED') {
    return { role: 'GUEST', status: 'REJECTED', reviewNote: app.reviewNote, positionTitle: null };
  }

  return { role: 'GUEST', status: 'NONE', positionTitle: null };
}

function dashboardRoute(e) {
  if (!e) return '/guest';
  if (e.status === 'AWAITING_PAYMENT') return '/pay';
  if (e.status === 'UNDER_REVIEW' || e.status === 'REJECTED') return '/application-status';
  const routes = {
    PRESIDENT: '/admin',
    TREASURER: '/finance',
    VOLUNTEER: '/volunteer',
    MEMBER: '/me',
    GUEST: '/',
  };
  return routes[e.role] || '/guest';
}

async function isActiveMember(userId) {
  if (!userId) return false;
  const now = new Date();
  const membership = await prisma.membership.findFirst({
    where: { userId, status: 'ACTIVE', expiryDate: { gt: now } },
  });
  return Boolean(membership);
}

async function assertOfficerCandidate(userId) {
  const isMember = await isActiveMember(userId);
  if (!isMember) {
    throw badRequest('NOT_MEMBER', 'Officer candidate must be an active member');
  }
  return true;
}

module.exports = {
  getEffectiveRole,
  dashboardRoute,
  isActiveMember,
  assertOfficerCandidate,
};
