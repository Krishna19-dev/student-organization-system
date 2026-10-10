const express = require('express');
const router = express.Router();
const announcementsController = require('./announcements.controller');
const { optionalAuth, requireAuth } = require('../../middleware/auth');
const { requireRole } = require('../../middleware/roles');

router.get('/', optionalAuth, announcementsController.listAnnouncements);
router.post(
  '/',
  requireAuth,
  requireRole('PRESIDENT'),
  announcementsController.createAnnouncement
);
router.patch(
  '/:id',
  requireAuth,
  requireRole('PRESIDENT'),
  announcementsController.updateAnnouncement
);

module.exports = router;