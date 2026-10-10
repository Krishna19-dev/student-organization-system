const defaultPrisma = require('../lib/prisma');
const { badRequest, conflict, notFound } = require('../lib/errors');
const auditService = require('./audit.service');
const ledgerService = require('./ledger.service');
const { sendMail } = require('../lib/mailer');

async function applyLater(userId, { type, tier, skills, desiredPosition = 'NONE', notes }) {
  // Check active membership
  const activeMembership = await defaultPrisma.membership.findFirst({
    where: {
      userId,
      status: 'ACTIVE',
      expiryDate: { gt: new Date() },
    },
  });
  if (activeMembership) {
    throw conflict('ALREADY_APPLIED', 'You already have an active membership');
  }

  // Check pending or under-review applications
  const existingApp = await defaultPrisma.application.findFirst({
    where: {
      userId,
      status: { in: ['PAYMENT_PENDING', 'UNDER_REVIEW'] },
    },
  });
  if (existingApp) {
    throw conflict('ALREADY_APPLIED', 'You already have a pending or under-review application');
  }

  return await defaultPrisma.application.create({
    data: {
      userId,
      type: type || (desiredPosition && desiredPosition !== 'NONE' ? 'LEAD' : 'MEMBER'),
      tier: tier || 'BASIC',
      skills: skills || '',
      desiredPosition: desiredPosition || 'NONE',
      notes: notes || null,
      status: 'PAYMENT_PENDING',
    },
  });
}

async function getMyApplication(userId) {
  return await defaultPrisma.application.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      payment: true,
      reviewer: { select: { name: true, email: true } },
    },
  });
}

async function listApplications({ status = 'UNDER_REVIEW', page = 1, pageSize = 20 } = {}) {
  const p = Math.max(1, parseInt(page, 10) || 1);
  const ps = Math.max(1, Math.min(100, parseInt(pageSize, 10) || 20));

  const where = {};
  if (status) where.status = status;

  const [items, total] = await Promise.all([
    defaultPrisma.application.findMany({
      where,
      skip: (p - 1) * ps,
      take: ps,
      orderBy: { submittedAt: 'asc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        payment: true,
        reviewer: { select: { id: true, name: true } },
      },
    }),
    defaultPrisma.application.count({ where }),
  ]);

  return { items, total, page: p, pageSize: ps };
}

async function getApplicationById(id) {
  const app = await defaultPrisma.application.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      payment: true,
      reviewer: { select: { id: true, name: true } },
    },
  });
  if (!app) throw notFound('APPLICATION_NOT_FOUND', 'Application not found');
  return app;
}

async function approveApplication(applicationId, adminId, { assignedPosition, note } = {}) {
  const app = await defaultPrisma.application.findUnique({
    where: { id: applicationId },
    include: { user: true },
  });

  if (!app) throw notFound('APPLICATION_NOT_FOUND', 'Application not found');
  if (app.status !== 'UNDER_REVIEW') {
    throw conflict('INVALID_STATE', `Application status must be UNDER_REVIEW (current: ${app.status})`);
  }

  const finalPosition = assignedPosition || (app.desiredPosition !== 'NONE' ? app.desiredPosition : null);
  const now = new Date();
  const oneYearLater = new Date();
  oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

  const result = await defaultPrisma.$transaction(async (tx) => {
    // 1. Update application
    const updatedApp = await tx.application.update({
      where: { id: applicationId },
      data: {
        status: 'APPROVED',
        reviewerId: adminId,
        reviewNote: note || null,
        assignedPosition: finalPosition,
        reviewedAt: now,
      },
    });

    // 2. Activate membership
    await tx.membership.updateMany({
      where: { userId: app.userId, status: 'PENDING' },
      data: {
        status: 'ACTIVE',
        startDate: now,
        expiryDate: oneYearLater,
      },
    });

    // 3. If LEAD, assign role
    if (app.type === 'LEAD' || finalPosition) {
      await tx.roleAssignment.create({
        data: {
          userId: app.userId,
          role: 'VOLUNTEER',
          positionTitle: finalPosition || 'Team Lead',
          startDate: now,
        },
      });
    }

    // 4. Audit
    await auditService.log(tx, {
      actorId: adminId,
      action: 'APPLICATION_APPROVED',
      targetType: 'Application',
      targetId: applicationId,
    });

    return updatedApp;
  });

  // 5. Send notification email (outside transaction)
  sendMail({
    to: app.user.email,
    subject: 'Skyline Membership Approved!',
    html: `<h2>Congratulations, ${app.user.name}!</h2><p>Your Skyline student association membership has been approved.</p>`,
  }).catch(() => {});

  return result;
}

async function rejectApplication(applicationId, adminId, { note }) {
  if (!note) throw badRequest('NOTE_REQUIRED', 'A reason note is required for rejection');

  const app = await defaultPrisma.application.findUnique({
    where: { id: applicationId },
    include: { user: true, payment: true },
  });

  if (!app) throw notFound('APPLICATION_NOT_FOUND', 'Application not found');
  if (app.status !== 'UNDER_REVIEW') {
    throw conflict('INVALID_STATE', `Application status must be UNDER_REVIEW (current: ${app.status})`);
  }

  const now = new Date();

  const result = await defaultPrisma.$transaction(async (tx) => {
    // 1. Update application to REJECTED
    const updatedApp = await tx.application.update({
      where: { id: applicationId },
      data: {
        status: 'REJECTED',
        reviewerId: adminId,
        reviewNote: note,
        reviewedAt: now,
      },
    });

    // 2. Delete PENDING membership placeholder
    await tx.membership.deleteMany({
      where: { userId: app.userId, status: 'PENDING' },
    });

    // 3. Refund guard & ledger entry
    if (app.payment && !app.payment.refundedAt) {
      await tx.payment.update({
        where: { id: app.payment.id },
        data: { refundedAt: now },
      });

      await ledgerService.post(tx, {
        type: 'EXPENSE',
        category: 'EXPENSE',
        amount: app.payment.amount,
        description: `Refund: application ${applicationId}`,
        createdById: adminId,
      });

      await auditService.log(tx, {
        actorId: adminId,
        action: 'REFUND_RECORDED',
        targetType: 'Payment',
        targetId: app.payment.id,
      });
    }

    // 4. Audit rejection
    await auditService.log(tx, {
      actorId: adminId,
      action: 'APPLICATION_REJECTED',
      targetType: 'Application',
      targetId: applicationId,
    });

    return updatedApp;
  });

  // 5. Email applicant
  sendMail({
    to: app.user.email,
    subject: 'Skyline Application Status Update',
    html: `<p>Dear ${app.user.name},</p><p>Your application was reviewed and could not be approved at this time.</p><p>Reason: ${note}</p>`,
  }).catch(() => {});

  return result;
}

module.exports = {
  applyLater,
  getMyApplication,
  listApplications,
  getApplicationById,
  approveApplication,
  rejectApplication,
};
