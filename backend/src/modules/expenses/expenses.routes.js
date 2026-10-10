const express = require('express');
const router = express.Router();
const expensesController = require('./expenses.controller');
const { requireAuth } = require('../../middleware/auth');
const { requireRole } = require('../../middleware/roles');
const { uploadReceipt } = require('../../middleware/upload');

router.use(requireAuth);

router.post(
  '/',
  requireRole('VOLUNTEER', 'VP_EVENTS', 'TREASURER', 'PRESIDENT'),
  uploadReceipt,
  expensesController.submitClaim
);

router.get(
  '/mine',
  requireRole('VOLUNTEER', 'VP_EVENTS', 'TREASURER', 'PRESIDENT'),
  expensesController.myClaims
);

router.get(
  '/',
  requireRole('TREASURER', 'PRESIDENT'),
  expensesController.listClaims
);

router.post(
  '/:id/approve',
  requireRole('TREASURER', 'PRESIDENT'),
  expensesController.approveClaim
);

router.post(
  '/:id/reject',
  requireRole('TREASURER', 'PRESIDENT'),
  expensesController.rejectClaim
);

router.post(
  '/:id/pay',
  requireRole('TREASURER', 'PRESIDENT'),
  expensesController.payClaim
);

router.get(
  '/:id/receipt',
  expensesController.getReceipt
);

module.exports = router;