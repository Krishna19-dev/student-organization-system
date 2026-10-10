const express = require('express');
const router = express.Router();
const financeController = require('./finance.controller');
const { requireAuth } = require('../../middleware/auth');
const { requireRole } = require('../../middleware/roles');

router.use(requireAuth);

router.get(
  '/summary',
  requireRole('TREASURER', 'PRESIDENT'),
  financeController.summary
);

router.get(
  '/breakdown',
  requireRole('TREASURER', 'PRESIDENT'),
  financeController.breakdown
);

router.get(
  '/events/:id',
  requireRole('VP_EVENTS', 'TREASURER', 'PRESIDENT'),
  financeController.eventPnl
);

router.get(
  '/ledger',
  requireRole('TREASURER', 'PRESIDENT'),
  financeController.ledger
);

router.get(
  '/export.csv',
  requireRole('TREASURER', 'PRESIDENT'),
  financeController.exportCsv
);

module.exports = router;