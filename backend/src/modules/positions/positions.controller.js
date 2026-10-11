const positionsService = require('./positions.service');
const asyncHandler = require('../../lib/asyncHandler');
const { badRequest, notFound } = require('../../lib/errors');

exports.listPublic = asyncHandler(async (req, res) => {
  const positions = await positionsService.listOpenPositions();
  res.json({
    count: positions.length,
    positions,
  });
});

exports.listAdmin = asyncHandler(async (req, res) => {
  const positions = await positionsService.listAllPositions();
  res.json({
    count: positions.length,
    positions,
  });
});

exports.create = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    throw badRequest('TITLE_AND_DESC_REQUIRED', 'Title and description are required.');
  }
  const pos = await positionsService.createPosition(req.body);
  res.status(201).json(pos);
});

exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updated = await positionsService.updatePosition(id, req.body);
  if (!updated) {
    throw notFound('POSITION_NOT_FOUND', 'Position not found');
  }
  res.json(updated);
});

exports.toggle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const toggled = await positionsService.togglePositionOpen(id);
  if (!toggled) {
    throw notFound('POSITION_NOT_FOUND', 'Position not found');
  }
  res.json(toggled);
});

exports.remove = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await positionsService.deletePosition(id);
  if (!deleted) {
    throw notFound('POSITION_NOT_FOUND', 'Position not found');
  }
  res.json({ success: true, message: 'Position deleted successfully' });
});
