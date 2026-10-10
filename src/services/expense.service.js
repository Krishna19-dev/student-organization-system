const defaultPrisma = require('../lib/prisma');
const { badRequest, notFound, forbidden, conflict } = require('../lib/errors');
const auditService = require('./audit.service');
const ledgerService = require('./ledger.service');
const { sendMail } = require('../lib/mailer');

async function submitClaim(userId, { amount, description, eventId, receiptUrl }) {
  const amt = parseInt(amount, 10);
  if (!amt || amt <= 0) {
    throw badRequest('INVALID_AMOUNT', 'Amount must be a positive integer in paise');
  }
  if (!description) {
    throw badRequest('DESCRIPTION_REQUIRED', 'Description is required');
  }

  return await defaultPrisma.expenseClaim.create({
    data: {
      userId,
      amount: amt,
      description,
      eventId: eventId || null,
      receiptUrl: receiptUrl || null,
      status: 'PENDING',
    },
  });
}

async function getMyClaims(userId) {
  return await defaultPrisma.expenseClaim.findMany({
    where: { userId },
    include: { event: { select: { id: true, title: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

async function listClaims({ status, page = 1, pageSize = 20 } = {}) {
  const p = Math.max(1, parseInt(page, 10) || 1);
  const ps = Math.max(1, Math.min(100, parseInt(pageSize, 10) || 20));

  const where = {};
  if (status) where.status = status;

  const [items, total] = await Promise.all([
    defaultPrisma.expenseClaim.findMany({
      where,
      skip: (p - 1) * ps,
      take: ps,
      orderBy: { createdAt: 'asc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        event: { select: { id: true, title: true } },
      },
    }),
    defaultPrisma.expenseClaim.count({ where }),
  ]);

  return { items, total, page: p, pageSize: ps };
}

async function approveClaim(claimId, reviewerId, reviewerRole) {
  const claim = await defaultPrisma.expenseClaim.findUnique({
    where: { id: claimId },
  });

  if (!claim) throw notFound('CLAIM_NOT_FOUND', 'Expense claim not found');
  if (claim.status !== 'PENDING') {
    throw conflict('INVALID_STATE', `Claim status must be PENDING (current: ${claim.status})`);
  }

  // Treasurer self-approval prevention (President is allowed)
  if (claim.userId === reviewerId && reviewerRole !== 'PRESIDENT') {
    throw forbidden('SELF_APPROVAL', 'Treasurers cannot approve their own expense claims');
  }

  return await defaultPrisma.$transaction(async (tx) => {
    const updated = await tx.expenseClaim.update({
      where: { id: claimId },
      data: {
        status: 'APPROVED',
      },
    });

    await auditService.log(tx, {
      actorId: reviewerId,
      action: 'CLAIM_APPROVED',
      targetType: 'ExpenseClaim',
      targetId: claimId,
    });

    return updated;
  });
}

async function rejectClaim(claimId, reviewerId, reason) {
  if (!reason) throw badRequest('REASON_REQUIRED', 'Rejection reason is required');

  const claim = await defaultPrisma.expenseClaim.findUnique({
    where: { id: claimId },
  });

  if (!claim) throw notFound('CLAIM_NOT_FOUND', 'Expense claim not found');
  if (claim.status !== 'PENDING') {
    throw conflict('INVALID_STATE', `Claim status must be PENDING (current: ${claim.status})`);
  }

  return await defaultPrisma.$transaction(async (tx) => {
    const updated = await tx.expenseClaim.update({
      where: { id: claimId },
      data: {
        status: 'REJECTED',
        reason,
      },
    });

    await auditService.log(tx, {
      actorId: reviewerId,
      action: 'CLAIM_REJECTED',
      targetType: 'ExpenseClaim',
      targetId: claimId,
    });

    return updated;
  });
}

async function payClaim(claimId, adminId) {
  const claim = await defaultPrisma.expenseClaim.findUnique({
    where: { id: claimId },
    include: { user: true },
  });

  if (!claim) throw notFound('CLAIM_NOT_FOUND', 'Expense claim not found');
  if (claim.status !== 'APPROVED') {
    throw conflict('INVALID_STATE', 'Only APPROVED claims can be marked as PAID');
  }

  const result = await defaultPrisma.$transaction(async (tx) => {
    const updated = await tx.expenseClaim.update({
      where: { id: claimId },
      data: {
        status: 'PAID',
      },
    });

    await ledgerService.post(tx, {
      type: 'EXPENSE',
      category: 'EXPENSE',
      amount: claim.amount,
      expenseClaimId: claim.id,
      eventId: claim.eventId || null,
      description: `Expense claim reimbursement: ${claim.description}`,
      createdById: adminId,
    });

    await auditService.log(tx, {
      actorId: adminId,
      action: 'CLAIM_PAID',
      targetType: 'ExpenseClaim',
      targetId: claimId,
    });

    return updated;
  });

  // Notify claimant
  sendMail({
    to: claim.user.email,
    subject: 'Expense Claim Reimbursed',
    html: `<p>Hi ${claim.user.name},</p><p>Your expense claim for ₹${(claim.amount / 100).toFixed(2)} has been marked as PAID.</p>`,
  }).catch(() => {});

  return result;
}

async function getClaimById(id) {
  const claim = await defaultPrisma.expenseClaim.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      event: true,
    },
  });
  if (!claim) throw notFound('CLAIM_NOT_FOUND', 'Claim not found');
  return claim;
}

module.exports = {
  submitClaim,
  getMyClaims,
  listClaims,
  approveClaim,
  rejectClaim,
  payClaim,
  getClaimById,
};
