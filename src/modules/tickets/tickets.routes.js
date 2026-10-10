const express = require('express');
const router = express.Router();
const ticketsController = require('./tickets.controller');
const { requireRole } = require('../../middleware/roles');
const { requireAuth: authMiddleware } = require('../../middleware/auth');

router.use(authMiddleware);

router.post('/verify-payment', ticketsController.verifyPayment);
router.get('/mine', ticketsController.getMyTickets);
router.post('/checkin', requireRole('VOLUNTEER', 'VP_EVENTS', 'PRESIDENT'), ticketsController.checkin);

module.exports = router;