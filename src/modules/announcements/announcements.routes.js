const express = require('express');
const router = express.Router();
const controller = require('./announcements.controller');
const { requireRole } = require('../../middleware/roles');
const { requireAuth: authMiddleware } = require('../../middleware/auth');

router.get('/', controller.getAnnouncements);

router.use(authMiddleware);
router.post('/', requireRole('VP_EVENTS', 'PRESIDENT'), controller.createAnnouncement);
router.patch('/:id', requireRole('VP_EVENTS', 'PRESIDENT'), controller.updateAnnouncement);

module.exports = router;