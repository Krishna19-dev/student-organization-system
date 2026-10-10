const express = require('express');
const router = express.Router();
const eventsController = require('./events.controller');
const { requireRole } = require('../../middleware/roles');
const { requireAuth, optionalAuth } = require('../../middleware/auth');

router.get('/', eventsController.listEvents);
router.get('/:id', eventsController.getEvent);
router.post('/:id/checkout', optionalAuth, eventsController.checkout);

router.post('/', requireAuth, requireRole('PRESIDENT'), eventsController.createEvent);
router.patch('/:id', requireAuth, requireRole('PRESIDENT'), eventsController.updateEvent);
router.get('/:id/report', requireAuth, requireRole('TREASURER', 'PRESIDENT'), eventsController.eventReport);

module.exports = router;