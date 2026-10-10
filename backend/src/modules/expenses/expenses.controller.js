const path = require('path');
const fs = require('fs');
const expenseService = require('../../services/expense.service');
const { badRequest, notFound, forbidden } = require('../../lib/errors');
const asyncHandler = require('../../lib/asyncHandler');
const { uploadDir } = require('../../middleware/upload');

exports.submitClaim = asyncHandler(async (req, res) => {
  const { amount, description, eventId } = req.body;
  const receiptFile = req.file;

  if (!receiptFile) {
    throw badRequest('RECEIPT_REQUIRED', 'Receipt file attachment is required');
  }

  const claim = await expenseService.submitClaim(req.user.id, {
    amount,
    description,
    eventId,
    receiptUrl: receiptFile.filename,
  });

  res.status(201).json(claim);
});

exports.myClaims = asyncHandler(async (req, res) => {
  const claims = await expenseService.getMyClaims(req.user.id);
  res.json(claims);
});

exports.listClaims = asyncHandler(async (req, res) => {
  const { status, page, pageSize } = req.query;
  const result = await expenseService.listClaims({ status, page, pageSize });
  res.json(result);
});

exports.approveClaim = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const role = req.effective?.role;
  const claim = await expenseService.approveClaim(id, req.user.id, role);
  res.json(claim);
});

exports.rejectClaim = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  const claim = await expenseService.rejectClaim(id, req.user.id, reason);
  res.json(claim);
});

exports.payClaim = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const claim = await expenseService.payClaim(id, req.user.id);
  res.json({ message: 'Claim marked as PAID and recorded in ledger', claim });
});

exports.getReceipt = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const claim = await expenseService.getClaimById(id);

  const role = req.effective?.role;
  const isOfficer = ['TREASURER', 'PRESIDENT'].includes(role);
  if (!isOfficer && claim.userId !== req.user.id) {
    throw forbidden('FORBIDDEN', 'You do not have permission to view this receipt');
  }

  if (!claim.receiptUrl) {
    throw notFound('NO_RECEIPT', 'No receipt attached to this claim');
  }

  const filePath = path.join(uploadDir, claim.receiptUrl);
  if (!fs.existsSync(filePath)) {
    throw notFound('FILE_NOT_FOUND', 'Receipt file not found on disk');
  }

  res.sendFile(filePath);
});
