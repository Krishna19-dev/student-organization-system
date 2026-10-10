const express = require('express');
const router = express.Router();
const eventsController = require('./events.controller');
const { requireRole } = require('../../middleware/roles');
const { requireAuth: authMiddleware } = require('../../middleware/auth');

router.get('/', eventsController.listEvents);
router.get('/:id', eventsController.getEvent);

// Protected routes
router.use(authMiddleware);
router.post('/', requireRole('VP_EVENTS', 'PRESIDENT'), eventsController.createEvent);
router.patch('/:id', requireRole('VP_EVENTS', 'PRESIDENT'), eventsController.updateEvent);
router.get('/:id/report', requireRole('VP_EVENTS', 'TREASURER', 'PRESIDENT'), eventsController.getReport);

// Checkout
router.post('/:id/checkout', eventsController.checkoutTicket);

module.exports = router;