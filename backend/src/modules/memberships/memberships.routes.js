const express = require('express');
const router = express.Router();
const membershipsController = require('./memberships.controller');
const { requireAuth } = require('../../middleware/auth');
const { requireRole, requireActiveMember } = require('../../middleware/roles');

router.get('/card', requireAuth, requireActiveMember, membershipsController.myCard);
router.get(
  '/verify/:qrToken',
  requireAuth,
  requireRole('VOLUNTEER', 'VP_EVENTS', 'PRESIDENT'),
  membershipsController.verifyMember
);

module.exports = router;