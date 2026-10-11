const express = require('express');
const router = express.Router();
const appController = require('./applications.controller');
const { requireAuth } = require('../../middleware/auth');
const { requireRole } = require('../../middleware/roles');

// ── Public Onboarding & Tracking Routes (No login required) ──
router.post('/onboard', appController.publicOnboard);
router.post('/verify-onboard', appController.verifyOnboard);
router.get('/status/:id', appController.getStatusById);

// ── Admin & President Review Routes ──
router.get('/admin', requireAuth, requireRole('PRESIDENT', 'TREASURER'), appController.listAdminApplications);
router.get('/metrics', requireAuth, requireRole('PRESIDENT', 'TREASURER'), appController.adminGetMetrics);
router.post('/admin/:id/approve', requireAuth, requireRole('PRESIDENT'), appController.adminApprove);
router.post('/admin/:id/reject', requireAuth, requireRole('PRESIDENT'), appController.adminReject);

// ── Authenticated Member Routes ──
router.post('/', requireAuth, appController.applyLater);
router.get('/mine', requireAuth, appController.myApplication);
router.post('/pay', requireAuth, appController.createDuesOrder);
router.post('/verify', requireAuth, appController.verifyDues);

module.exports = router;