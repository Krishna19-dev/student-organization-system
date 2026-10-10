const prisma = require('../../lib/prisma');
const { sendBulk } = require('../../lib/mailer');
const { badRequest, notFound, forbidden } = require('../../lib/errors');
const asyncHandler = require('../../lib/asyncHandler');

exports.listAnnouncements = asyncHandler(async (req, res) => {
  const { q, page = 1, pageSize = 20 } = req.query;
  const p = Math.max(1, parseInt(page, 10) || 1);
  const ps = Math.max(1, Math.min(100, parseInt(pageSize, 10) || 20));

  const role = req.effective?.role || 'GUEST';
  const isMemberOrAbove = ['MEMBER', 'VOLUNTEER', 'VP_EVENTS', 'TREASURER', 'PRESIDENT'].includes(role);

  const where = {};
  if (!isMemberOrAbove) {
    where.audience = 'PUBLIC';
  }

  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { content: { contains: q, mode: 'insensitive' } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.announcement.findMany({
      where,
      skip: (p - 1) * ps,
      take: ps,
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { id: true, name: true } } },
    }),
    prisma.announcement.count({ where }),
  ]);

  res.json({ items, page: p, pageSize: ps, total });
});

exports.createAnnouncement = asyncHandler(async (req, res) => {
  const { title, content, body, audience = 'PUBLIC' } = req.body;
  const text = content || body;

  if (!title || !text) {
    throw badRequest('VALIDATION_ERROR', 'Title and content/body are required');
  }

  const aud = audience.toUpperCase() === 'MEMBERS' ? 'MEMBERS' : 'PUBLIC';

  const announcement = await prisma.announcement.create({
    data: {
      title,
      content: text,
      audience: aud,
      authorId: req.user.id,
    },
    include: { author: { select: { id: true, name: true } } },
  });

  if (aud === 'MEMBERS') {
    const activeMembers = await prisma.membership.findMany({
      where: {
        status: 'ACTIVE',
        expiryDate: { gt: new Date() },
      },
      include: { user: { select: { email: true } } },
    });

    const emails = activeMembers.map((m) => m.user.email).filter(Boolean);
    sendBulk(emails, `Skyline Announcement: ${title}`, text).catch(() => {});
  }

  res.status(201).json(announcement);
});

exports.updateAnnouncement = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existing = await prisma.announcement.findUnique({ where: { id } });
  if (!existing) throw notFound('ANNOUNCEMENT_NOT_FOUND', 'Announcement not found');

  if (req.effective?.role !== 'PRESIDENT' && existing.authorId !== req.user.id) {
    throw forbidden('FORBIDDEN', 'You may only edit your own announcements');
  }

  const { title, content, body, audience } = req.body;
  const updateData = {};
  if (title) updateData.title = title;
  if (content || body) updateData.content = content || body;
  if (audience) updateData.audience = audience.toUpperCase() === 'MEMBERS' ? 'MEMBERS' : 'PUBLIC';

  const updated = await prisma.announcement.update({
    where: { id },
    data: updateData,
  });

  res.json(updated);
});
