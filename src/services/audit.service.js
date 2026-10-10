const prisma = require('../lib/prisma');

async function logAudit(actorId, action, targetId = null, target = null) {
  return await prisma.auditLog.create({
    data: {
      actorId,
      action,
      targetId,
      target
    }
  });
}

async function getRecentAuditLogs(limit = 50) {
  return await prisma.auditLog.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: { actor: { select: { email: true, name: true } } }
  });
}

module.exports = { logAudit, getRecentAuditLogs };
