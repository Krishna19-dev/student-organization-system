const prisma = require('../../lib/prisma');
const ledgerService = require('../../services/ledger.service');
const { getEffectiveRole } = require('../../services/role.service');
const { badRequest, notFound, forbidden } = require('../../lib/errors');
const asyncHandler = require('../../lib/asyncHandler');

// Fundraisers
exports.createFundraiser = asyncHandler(async (req, res) => {
  const { title, name, date, target, targetAmount } = req.body;
  const tTitle = title || name;
  const tgt = parseInt(target || targetAmount, 10);

  if (!tTitle || isNaN(tgt) || tgt <= 0) {
    throw badRequest('VALIDATION_ERROR', 'Fundraiser title and valid target amount in paise are required');
  }

  const fundraiser = await prisma.fundraiser.create({
    data: {
      title: tTitle,
      date: date ? new Date(date) : new Date(),
      target: tgt,
    },
  });

  res.status(201).json(fundraiser);
});

exports.getFundraiser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const fundraiser = await prisma.fundraiser.findUnique({
    where: { id },
    include: {
      tasks: true,
      ledgerEntries: { where: { type: 'INCOME', category: 'FUNDRAISER' } },
    },
  });

  if (!fundraiser) throw notFound('FUNDRAISER_NOT_FOUND', 'Fundraiser not found');

  const totalTasks = fundraiser.tasks.length;
  const doneTasks = fundraiser.tasks.filter((t) => t.status === 'DONE').length;
  const progress = totalTasks > 0 ? doneTasks / totalTasks : 0;

  const raised = fundraiser.ledgerEntries.reduce((acc, entry) => acc + entry.amount, 0);

  res.json({
    ...fundraiser,
    progress,
    raised,
    totalTasks,
    doneTasks,
  });
});

exports.recordTakings = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { amount, description } = req.body;
  const amt = parseInt(amount, 10);

  if (isNaN(amt) || amt <= 0) {
    throw badRequest('INVALID_AMOUNT', 'Amount must be a positive integer in paise');
  }

  const fundraiser = await prisma.fundraiser.findUnique({ where: { id } });
  if (!fundraiser) throw notFound('FUNDRAISER_NOT_FOUND', 'Fundraiser not found');

  const entry = await ledgerService.post({
    type: 'INCOME',
    category: 'FUNDRAISER',
    amount: amt,
    fundraiserId: id,
    description: description || `Takings for ${fundraiser.title}`,
    createdById: req.user.id,
  });

  res.status(201).json(entry);
});

// Tasks
exports.createTask = asyncHandler(async (req, res) => {
  const { title, dueDate, assigneeId, eventId, fundraiserId } = req.body;

  if (!title || !assigneeId) {
    throw badRequest('VALIDATION_ERROR', 'Title and assigneeId are required');
  }

  // Assignee must hold VOLUNTEER or higher
  const assigneeEffective = await getEffectiveRole(assigneeId);
  const eligible = ['VOLUNTEER', 'VP_EVENTS', 'TREASURER', 'PRESIDENT'].includes(assigneeEffective.role);
  if (!eligible) {
    throw badRequest('INELIGIBLE_ASSIGNEE', 'Assignee must hold VOLUNTEER or higher office');
  }

  const task = await prisma.task.create({
    data: {
      title,
      assigneeId,
      dueDate: dueDate ? new Date(dueDate) : null,
      eventId: eventId || null,
      fundraiserId: fundraiserId || null,
      status: 'TODO',
    },
    include: {
      assignee: { select: { id: true, name: true, email: true } },
    },
  });

  res.status(201).json(task);
});

exports.listTasks = asyncHandler(async (req, res) => {
  const { eventId, fundraiserId, status } = req.query;
  const where = {};
  if (eventId) where.eventId = eventId;
  if (fundraiserId) where.fundraiserId = fundraiserId;
  if (status) where.status = status;

  const tasks = await prisma.task.findMany({
    where,
    include: {
      assignee: { select: { id: true, name: true, email: true } },
      event: { select: { id: true, title: true } },
      fundraiser: { select: { id: true, title: true } },
      deliverable: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json(tasks);
});

exports.myTasks = asyncHandler(async (req, res) => {
  const tasks = await prisma.task.findMany({
    where: { assigneeId: req.user.id },
    include: {
      event: { select: { id: true, title: true } },
      fundraiser: { select: { id: true, title: true } },
      deliverable: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json(tasks);
});

exports.updateTaskStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['TODO', 'IN_PROGRESS', 'DONE'].includes(status)) {
    throw badRequest('INVALID_STATUS', 'Status must be TODO, IN_PROGRESS, or DONE');
  }

  const task = await prisma.task.findUnique({
    where: { id },
    include: { deliverable: true },
  });

  if (!task) throw notFound('TASK_NOT_FOUND', 'Task not found');

  const role = req.effective?.role;
  const isOfficer = ['VP_EVENTS', 'PRESIDENT'].includes(role);
  if (!isOfficer && task.assigneeId !== req.user.id) {
    throw forbidden('FORBIDDEN', 'Volunteers can only update the status of their own tasks');
  }

  const updated = await prisma.$transaction(async (tx) => {
    const t = await tx.task.update({
      where: { id },
      data: { status },
    });

    if (task.deliverableId && status === 'DONE') {
      await tx.deliverable.update({
        where: { id: task.deliverableId },
        data: { status: 'DONE' },
      });
    }

    return t;
  });

  res.json(updated);
});
