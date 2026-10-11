const express = require('express');
const router = express.Router();
const membershipsController = require('./memberships.controller');
const { requireAuth } = require('../../middleware/auth');
const { requireRole } = require('../../middleware/roles');

// All Real Database Members (Roster & Admin)
router.get('/', membershipsController.getAllMembers);

// Public Plans
router.get('/plans', membershipsController.getPlans);
router.get('/tiers', membershipsController.getPlans);

// Member Digital Card & QR (Authenticated Member)
router.get('/card', requireAuth, membershipsController.getIdCard);
router.get('/me/id-card', requireAuth, membershipsController.getIdCard);
router.get('/me/qr', requireAuth, membershipsController.getQr);

// Public Verification (Anyone scanning member QR)
router.get('/verify/:token', membershipsController.verifyPublic);

// Staff Verification (President, Admin, Volunteer Gate Checkers)
router.get(
  '/staff/verify/:token',
  requireAuth,
  requireRole('VOLUNTEER', 'PRESIDENT'),
  membershipsController.verifyStaff
);

module.exports = router;