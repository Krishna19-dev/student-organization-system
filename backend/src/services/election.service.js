const defaultPrisma = require('../lib/prisma');
const { badRequest, conflict } = require('../lib/errors');
const { isActiveMember } = require('./role.service');
const auditService = require('./audit.service');

async function electOfficer(adminId, { userId, role }) {
  if (!['VP_EVENTS', 'TREASURER'].includes(role)) {
    throw badRequest('INVALID_ROLE', 'Only VP_EVENTS and TREASURER can be elected through this endpoint');
  }

  // Candidate must be an active member
  const isMember = await isActiveMember(userId);
  if (!isMember) {
    throw badRequest('NOT_MEMBER', 'Candidate must hold an active membership');
  }

  const now = new Date();

  // Find active assignment for this role
  const currentAssignment = await defaultPrisma.roleAssignment.findFirst({
    where: {
      role,
      startDate: { lte: now },
      OR: [{ endDate: null }, { endDate: { gt: now } }],
    },
  });

  if (currentAssignment && currentAssignment.userId === userId) {
    throw conflict('ALREADY_HOLDER', 'User is already holding this office');
  }

  return await defaultPrisma.$transaction(async (tx) => {
    // 1. Revoke existing holder if present
    if (currentAssignment) {
      await tx.roleAssignment.update({
        where: { id: currentAssignment.id },
        data: { endDate: now },
      });

      await auditService.log(tx, {
        actorId: adminId,
        action: 'ROLE_REVOKED',
        targetType: 'RoleAssignment',
        targetId: currentAssignment.id,
      });
    }

    // 2. Create new assignment
    const newAssignment = await tx.roleAssignment.create({
      data: {
        userId,
        role,
        startDate: now,
      },
    });

    // 3. Audit assignment
    await auditService.log(tx, {
      actorId: adminId,
      action: 'ROLE_ASSIGNED',
      targetType: 'RoleAssignment',
      targetId: newAssignment.id,
    });

    return newAssignment;
  });
}

async function listRoleAssignments() {
  const now = new Date();
  const assignments = await defaultPrisma.roleAssignment.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { startDate: 'desc' },
  });

  return assignments.map((a) => {
    const isCurrent = a.startDate <= now && (!a.endDate || a.endDate > now);
    return {
      ...a,
      isCurrent,
    };
  });
}

module.exports = {
  electOfficer,
  listRoleAssignments,
};
