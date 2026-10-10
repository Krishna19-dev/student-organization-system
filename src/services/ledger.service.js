const defaultPrisma = require('../lib/prisma');
const { badRequest } = require('../lib/errors');

async function post(txOrData, maybeData) {
  let client = defaultPrisma;
  let data = txOrData;

  if (txOrData && txOrData.ledgerEntry) {
    client = txOrData;
    data = maybeData;
  }

  const {
    type,
    category,
    amount,
    description,
    eventId,
    fundraiserId,
    paymentId,
    expenseClaimId,
    contributionId,
    createdById,
  } = data || {};

  if (!Number.isInteger(amount) || amount <= 0) {
    throw badRequest('INVALID_AMOUNT', 'Amount must be a positive integer in paise');
  }

  return await client.ledgerEntry.create({
    data: {
      type,
      category,
      amount,
      description,
      eventId: eventId || null,
      fundraiserId: fundraiserId || null,
      paymentId: paymentId || null,
      expenseClaimId: expenseClaimId || null,
      contributionId: contributionId || null,
      createdById: createdById || null,
    },
  });
}

async function postIncome(txOrData, maybeData) {
  if (txOrData && txOrData.ledgerEntry) {
    return post(txOrData, { ...maybeData, type: 'INCOME' });
  }
  return post({ ...txOrData, type: 'INCOME' });
}

async function postExpense(txOrData, maybeData) {
  if (txOrData && txOrData.ledgerEntry) {
    return post(txOrData, { ...maybeData, type: 'EXPENSE' });
  }
  return post({ ...txOrData, type: 'EXPENSE' });
}

async function summary({ from, to } = {}) {
  const where = {};
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);
  }

  const [incomeResult, expenseResult] = await Promise.all([
    defaultPrisma.ledgerEntry.aggregate({
      where: { ...where, type: 'INCOME' },
      _sum: { amount: true },
    }),
    defaultPrisma.ledgerEntry.aggregate({
      where: { ...where, type: 'EXPENSE' },
      _sum: { amount: true },
    }),
  ]);

  const totalIncome = incomeResult._sum.amount || 0;
  const totalExpenses = expenseResult._sum.amount || 0;
  const balance = totalIncome - totalExpenses;

  return { totalIncome, totalExpenses, balance };
}

async function breakdown({ from, to } = {}) {
  const where = {};
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);
  }

  const groups = await defaultPrisma.ledgerEntry.groupBy({
    by: ['type', 'category'],
    where,
    _sum: { amount: true },
  });

  const categories = {};
  let totalExpenses = 0;
  let totalIncome = 0;

  for (const g of groups) {
    const amt = g._sum.amount || 0;
    if (g.type === 'INCOME') {
      categories[g.category] = amt;
      totalIncome += amt;
    } else {
      totalExpenses += amt;
    }
  }

  return {
    incomeByCategory: categories,
    totalIncome,
    totalExpenses,
    net: totalIncome - totalExpenses,
  };
}

async function eventPnl(eventId) {
  const [incomeEntries, expenseEntries] = await Promise.all([
    defaultPrisma.ledgerEntry.findMany({
      where: { eventId, type: 'INCOME' },
    }),
    defaultPrisma.ledgerEntry.findMany({
      where: { eventId, type: 'EXPENSE' },
    }),
  ]);

  const incomeByCategory = {};
  let revenue = 0;
  for (const e of incomeEntries) {
    incomeByCategory[e.category] = (incomeByCategory[e.category] || 0) + e.amount;
    revenue += e.amount;
  }

  let expenses = 0;
  for (const e of expenseEntries) {
    expenses += e.amount;
  }

  return {
    eventId,
    incomeByCategory,
    revenue,
    expenses,
    net: revenue - expenses,
  };
}

async function list({ from, to, category, type, eventId, fundraiserId, page = 1, pageSize = 20 } = {}) {
  const p = Math.max(1, parseInt(page, 10) || 1);
  const ps = Math.max(1, Math.min(100, parseInt(pageSize, 10) || 20));

  const where = {};
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);
  }
  if (category) where.category = category;
  if (type) where.type = type;
  if (eventId) where.eventId = eventId;
  if (fundraiserId) where.fundraiserId = fundraiserId;

  const [items, total] = await Promise.all([
    defaultPrisma.ledgerEntry.findMany({
      where,
      skip: (p - 1) * ps,
      take: ps,
      orderBy: { createdAt: 'desc' },
      include: {
        event: { select: { id: true, title: true } },
      },
    }),
    defaultPrisma.ledgerEntry.count({ where }),
  ]);

  return { items, page: p, pageSize: ps, total };
}

function toCsv(rows) {
  const headers = ['date', 'type', 'category', 'amount_rupees', 'description', 'event'];
  const lines = [headers.join(',')];

  for (const r of rows) {
    const date = r.createdAt ? new Date(r.createdAt).toISOString() : '';
    const type = r.type || '';
    const cat = r.category || '';
    const rupees = ((r.amount || 0) / 100).toFixed(2);
    const desc = `"${(r.description || '').replace(/"/g, '""')}"`;
    const eventTitle = r.event ? `"${r.event.title.replace(/"/g, '""')}"` : '""';

    lines.push([date, type, cat, rupees, desc, eventTitle].join(','));
  }

  return lines.join('\n');
}

module.exports = {
  post,
  postIncome,
  postExpense,
  createIncomeEntry: (data) => postIncome(defaultPrisma, data),
  createExpenseEntry: (data) => postExpense(defaultPrisma, data),
  summary,
  breakdown,
  eventPnl,
  list,
  toCsv,
};
