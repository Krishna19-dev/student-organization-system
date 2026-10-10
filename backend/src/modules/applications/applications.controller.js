const applicationService = require('../../services/application.service');
const paymentService = require('../../services/payment.service');
const prisma = require('../../lib/prisma');
const { notFound, badRequest } = require('../../lib/errors');
const asyncHandler = require('../../lib/asyncHandler');

exports.applyLater = asyncHandler(async (req, res) => {
  const application = await applicationService.applyLater(req.user.id, req.body);
  res.status(201).json(application);
});

exports.myApplication = asyncHandler(async (req, res) => {
  const application = await applicationService.getMyApplication(req.user.id);
  res.json(application || { status: 'NONE' });
});

exports.createDuesOrder = asyncHandler(async (req, res) => {
  const app = await prisma.application.findFirst({
    where: { userId: req.user.id, status: 'PAYMENT_PENDING' },
    orderBy: { createdAt: 'desc' },
  });

  if (!app) {
    throw notFound('NO_PENDING_APPLICATION', 'No pending application found requiring dues payment');
  }

  // Load price for tier
  let plan = await prisma.membershipPlan.findUnique({
    where: { tier: app.tier },
  });

  // Default fallback if plans not seeded yet
  const amount = plan ? plan.price : app.tier === 'PREMIUM' ? 100000 : 50000;

  const order = await paymentService.createOrder({
    purpose: 'DUES',
    amount,
    userId: req.user.id,
    meta: { applicationId: app.id },
  });

  await prisma.application.update({
    where: { id: app.id },
    data: { paymentId: order.paymentId },
  });

  res.json(order);
});

exports.verifyDues = asyncHandler(async (req, res) => {
  const { gatewayOrderId, gatewayPaymentId, signature } = req.body;
  if (!gatewayOrderId) {
    throw badRequest('ORDER_ID_REQUIRED', 'Gateway order ID is required');
  }

  const result = await paymentService.confirmPayment({
    gatewayOrderId,
    gatewayPaymentId: gatewayPaymentId || `pay_${Date.now()}`,
    signature: signature || 'mock_signature',
    actorId: req.user.id,
  });

  res.json({
    message: 'Dues payment confirmed successfully',
    ...result,
  });
});
