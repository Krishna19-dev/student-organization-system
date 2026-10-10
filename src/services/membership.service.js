const crypto = require('crypto');
const prisma = require('../lib/prisma');
const { toDataUrl } = require('../lib/qr');
const { notFound } = require('../lib/errors');

function generateRandomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let res = '';
  for (let i = 0; i < 6; i++) {
    res += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SKY-${res}`;
}

async function generateUniqueMemberCode(tx = prisma) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateRandomCode();
    const existing = await tx.membership.findUnique({
      where: { memberCode: code },
    });
    if (!existing) return code;
  }
  // Fallback to timestamp hex if 5 collisions happen
  return `SKY-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
}

async function isMembershipActive(userId) {
  const membership = await prisma.membership.findFirst({
    where: {
      userId,
      status: 'ACTIVE',
      expiryDate: { gt: new Date() },
    },
  });
  return !!membership;
}

async function getMyCard(userId) {
  const membership = await prisma.membership.findFirst({
    where: {
      userId,
      status: 'ACTIVE',
      expiryDate: { gt: new Date() },
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
      membershipPlan: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!membership) {
    throw notFound('NO_ACTIVE_MEMBERSHIP', 'No active membership found');
  }

  const qrDataUrl = membership.qrToken ? await toDataUrl(membership.qrToken) : null;

  return {
    id: membership.id,
    name: membership.user.name,
    email: membership.user.email,
    memberCode: membership.memberCode,
    tier: membership.membershipPlan?.tier,
    startDate: membership.startDate,
    expiryDate: membership.expiryDate,
    status: membership.status,
    qrDataUrl,
  };
}

async function verifyMemberByToken(qrToken) {
  const membership = await prisma.membership.findUnique({
    where: { qrToken },
    include: {
      user: { select: { name: true, email: true } },
      membershipPlan: true,
    },
  });

  if (!membership) {
    return { valid: false, message: 'Invalid QR token' };
  }

  const now = new Date();
  const isValid = membership.status === 'ACTIVE' && membership.expiryDate && membership.expiryDate > now;

  return {
    valid: isValid,
    name: membership.user.name,
    memberCode: membership.memberCode,
    tier: membership.membershipPlan?.tier,
    expiryDate: membership.expiryDate,
    status: membership.status,
  };
}

async function getExpiringMemberships(days = 30) {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);

  return await prisma.membership.findMany({
    where: {
      status: 'ACTIVE',
      expiryDate: {
        gte: now,
        lte: futureDate,
      },
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
      membershipPlan: true,
    },
    orderBy: { expiryDate: 'asc' },
  });
}

async function listMembers({ search, page = 1, pageSize = 20 } = {}) {
  const p = Math.max(1, parseInt(page, 10) || 1);
  const ps = Math.max(1, Math.min(100, parseInt(pageSize, 10) || 20));

  const where = {};
  if (search) {
    where.user = {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ],
    };
  }

  const [items, total] = await Promise.all([
    prisma.membership.findMany({
      where,
      skip: (p - 1) * ps,
      take: ps,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        membershipPlan: true,
      },
    }),
    prisma.membership.count({ where }),
  ]);

  return { items, page: p, pageSize: ps, total };
}

module.exports = {
  generateUniqueMemberCode,
  isMembershipActive,
  getMyCard,
  verifyMemberByToken,
  getExpiringMemberships,
  listMembers,
};
