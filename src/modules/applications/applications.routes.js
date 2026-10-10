const express = require('express');
const router = express.Router();
const appController = require('./applications.controller');
const { requireAuth, requireRole } = require('../../middleware/roles');
const { requireAuth: authMiddleware } = require('../../middleware/auth');

router.use(authMiddleware);

// User viewing their own applications
router.get('/mine', appController.getMyApplications);

// Paying dues
router.post('/pay', appController.payDues);
router.post('/verify', appController.verifyPayment);

// Admin routes
router.get('/admin', requireRole('PRESIDENT'), appController.getAdminQueue);
router.get('/admin/:id', requireRole('PRESIDENT'), appController.getApplicationDetails);
router.post('/admin/:id/approve', requireRole('PRESIDENT'), appController.approveApplication);
router.post('/admin/:id/reject', requireRole('PRESIDENT'), appController.rejectApplication);

module.exports = router;