const express = require('express');
const router = express.Router();
const ticketsController = require('./tickets.controller');
const { requireAuth, optionalAuth } = require('../../middleware/auth');
const { requireRole } = require('../../middleware/roles');

router.post('/verify-payment', optionalAuth, ticketsController.verifyTicketPayment);
router.get('/mine', requireAuth, ticketsController.myTickets);
router.post(
  '/checkin',
  requireAuth,
  requireRole('VOLUNTEER', 'PRESIDENT'),
  ticketsController.checkIn
);

module.exports = router;