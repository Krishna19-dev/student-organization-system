const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
const { requireAuth } = require('../../middleware/auth');
const { requireRole } = require('../../middleware/roles');

router.use(requireAuth);
router.use(requireRole('PRESIDENT'));

// Applications
router.get('/applications', adminController.listApplications);
router.get('/applications/:id', adminController.getApplication);
router.post('/applications/:id/approve', adminController.approveApplication);
router.post('/applications/:id/reject', adminController.rejectApplication);

// Payments manual override
router.post('/payments/:id/mark-paid', adminController.markPaymentPaid);

// Memberships
router.get('/memberships/expiring', adminController.expiringSoon);
router.get('/members', adminController.listMembers);

// Orders
router.get('/orders', adminController.adminOrders);

// Elections & Roles
router.post('/election', adminController.elect);
router.get('/roles', adminController.listRoles);

// Audit
router.get('/audit', adminController.auditLog);

module.exports = router;