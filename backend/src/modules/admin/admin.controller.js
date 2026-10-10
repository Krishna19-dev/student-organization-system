const applicationService = require('../../services/application.service');
const membershipService = require('../../services/membership.service');
const paymentService = require('../../services/payment.service');
const orderService = require('../../services/order.service');
const electionService = require('../../services/election.service');
const auditService = require('../../services/audit.service');
const asyncHandler = require('../../lib/asyncHandler');

// Applications
exports.listApplications = asyncHandler(async (req, res) => {
  const { status, page, pageSize } = req.query;
  const result = await applicationService.listApplications({ status, page, pageSize });
  res.json(result);
});

exports.getApplication = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const app = await applicationService.getApplicationById(id);
  res.json(app);
});

exports.approveApplication = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await applicationService.approveApplication(id, req.user.id, req.body);
  res.json({ message: 'Application approved successfully', application: result });
});

exports.rejectApplication = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await applicationService.rejectApplication(id, req.user.id, req.body);
  res.json({ message: 'Application rejected', application: result });
});

// Payments
exports.markPaymentPaid = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await paymentService.markPaidManually({ paymentId: id, adminId: req.user.id });
  res.json({ message: 'Payment manually marked as PAID', ...result });
});

// Memberships
exports.expiringSoon = asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days, 10) || 30;
  const memberships = await membershipService.getExpiringMemberships(days);
  res.json(memberships);
});

exports.listMembers = asyncHandler(async (req, res) => {
  const { search, page, pageSize } = req.query;
  const result = await membershipService.listMembers({ search, page, pageSize });
  res.json(result);
});

// Orders
exports.adminOrders = asyncHandler(async (req, res) => {
  const { status, page, pageSize } = req.query;
  const result = await orderService.listAdminOrders({ status, page, pageSize });
  res.json(result);
});

// Elections & Roles
exports.elect = asyncHandler(async (req, res) => {
  const result = await electionService.electOfficer(req.user.id, req.body);
  res.json({ message: 'Officer elected successfully', assignment: result });
});

exports.listRoles = asyncHandler(async (req, res) => {
  const result = await electionService.listRoleAssignments();
  res.json(result);
});

// Audit
exports.auditLog = asyncHandler(async (req, res) => {
  const { action, page, pageSize } = req.query;
  const result = await auditService.list({ action, page, pageSize });
  res.json(result);
});
