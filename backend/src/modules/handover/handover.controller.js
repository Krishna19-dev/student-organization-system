const prisma = require('../../lib/prisma');
const { badRequest, forbidden } = require('../../lib/errors');
const asyncHandler = require('../../lib/asyncHandler');

exports.writeNote = asyncHandler(async (req, res) => {
  const { content, role } = req.body;
  if (!content) throw badRequest('CONTENT_REQUIRED', 'Note content is required');

  const userRole = req.effective?.role;
  let targetRole = userRole;

  // President can specify which role the note belongs to
  if (userRole === 'PRESIDENT') {
    targetRole = role || 'PRESIDENT';
  }

  if (!['VOLUNTEER', 'TREASURER', 'PRESIDENT'].includes(targetRole)) {
    throw badRequest('INVALID_ROLE', 'A valid office role is required for handover notes');
  }

  const note = await prisma.handoverNote.create({
    data: {
      authorId: req.user.id,
      role: targetRole,
      content,
    },
    include: {
      author: { select: { id: true, name: true, email: true } },
    },
  });

  res.status(201).json(note);
});

exports.readNotes = asyncHandler(async (req, res) => {
  const userRole = req.effective?.role;
  const requestedRole = req.query.role;

  const where = {};

  if (userRole === 'PRESIDENT') {
    if (requestedRole) where.role = requestedRole;
  } else if (['TREASURER'].includes(userRole)) {
    // VP and Treasurer can only read notes for their own office
    where.role = userRole;
  } else {
    throw forbidden('FORBIDDEN', 'Insufficient permissions to view handover notes');
  }

  const notes = await prisma.handoverNote.findMany({
    where,
    include: {
      author: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json(notes);
});
