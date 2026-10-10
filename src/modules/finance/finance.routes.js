const express = require('express');
const router = express.Router();
const financeController = require('./finance.controller');
const { requireRole } = require('../../middleware/roles');
const { requireAuth: authMiddleware } = require('../../middleware/auth');

router.use(authMiddleware);
router.use(requireRole('TREASURER', 'PRESIDENT'));

router.get('/summary', financeController.getSummary);
router.get('/breakdown', financeController.getBreakdown);
router.get('/events/:id', financeController.getEventPnL);
router.get('/ledger', financeController.getLedger);

module.exports = router;