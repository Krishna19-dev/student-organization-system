const defaultPrisma = require('../lib/prisma');

async function log(txOrData, maybeData) {
  let client = defaultPrisma;
  let data = txOrData;

  // If first parameter is a prisma transaction client
  if (txOrData && typeof txOrData.$executeRaw === 'undefined' && txOrData.auditLog) {
    client = txOrData;
    data = maybeData;
  } else if (txOrData && txOrData.auditLog) {
    client = txOrData;
    data = maybeData;
  }

  const { actorId, action, targetType, targetId, details } = data || {};
  if (!actorId || !action) return null;

  return await client.auditLog.create({
    data: {
      actorId,
      action,
      targetId: targetId || null,
      target: targetType || (typeof details === 'string' ? details : JSON.stringify(details || {})),
    },
  });
}

async function list({ action, page = 1, pageSize = 20 }) {
  const p = Math.max(1, parseInt(page, 10) || 1);
  const ps = Math.max(1, Math.min(100, parseInt(pageSize, 10) || 20));
  const where = {};
  if (action) {
    where.action = action;
  }

  const [items, total] = await Promise.all([
    defaultPrisma.auditLog.findMany({
      where,
      skip: (p - 1) * ps,
      take: ps,
      orderBy: { createdAt: 'desc' },
      include: {
        actor: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
    defaultPrisma.auditLog.count({ where }),
  ]);

  return { items, page: p, pageSize: ps, total };
}

module.exports = {
  log,
  logAudit: (actorId, action, targetId, target) => log(defaultPrisma, { actorId, action, targetId, targetType: target }),
  list,
  getRecentAuditLogs: (limit = 50) =>
    defaultPrisma.auditLog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { actor: { select: { id: true, email: true, name: true } } },
    }),
};
