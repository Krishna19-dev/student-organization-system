const prisma = require('../../lib/prisma');
const crypto = require('crypto');
const { createIncomeEntry, createExpenseEntry } = require('../../services/ledger.service');

exports.getMyApplications = async (req, res, next) => {
  try {
    const apps = await prisma.application.findMany({ where: { userId: req.user.id } });
    res.json(apps);
  } catch (error) { next(error); }
};

exports.payDues = async (req, res, next) => {
  try {
    const application = await prisma.application.findFirst({
      where: { userId: req.user.id, status: 'PAYMENT_PENDING' }
    });
    if (!application) return res.status(404).json({ error: { message: 'No pending application found' } });
    
    // Create Razorpay order (mocked here)
    const orderId = 'order_mock_' + Date.now();
    const amount = 50000; // Mock amount based on tier

    const payment = await prisma.payment.create({
      data: {
        userId: req.user.id,
        orderId,
        amount,
        purpose: 'DUES'
      }
    });

    await prisma.application.update({
      where: { id: application.id },
      data: { paymentId: payment.id }
    });

    res.json({ orderId, amount });
  } catch (error) { next(error); }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const { paymentId, signature } = req.body; // mock verify
    
    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment || payment.status === 'PAID') return res.json({ message: 'Already paid' });
    
    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: paymentId },
        data: { status: 'PAID', signature }
      });

      const application = await tx.application.findUnique({ where: { paymentId } });
      await tx.application.update({
        where: { id: application.id },
        data: { status: 'UNDER_REVIEW', submittedAt: new Date() }
      });

      await tx.ledgerEntry.create({
        data: {
          type: 'INCOME',
          category: 'DUES',
          amount: payment.amount,
          paymentId: payment.id
        }
      });
    });

    res.json({ message: 'Payment verified, application under review' });
  } catch (error) { next(error); }
};

exports.getAdminQueue = async (req, res, next) => {
  try {
    const apps = await prisma.application.findMany({
      where: { status: 'UNDER_REVIEW' },
      include: { user: true }
    });
    res.json(apps);
  } catch (error) { next(error); }
};

exports.getApplicationDetails = async (req, res, next) => {
  try {
    const app = await prisma.application.findUnique({
      where: { id: req.params.id },
      include: { user: true, payment: true }
    });
    res.json(app);
  } catch (error) { next(error); }
};

exports.approveApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const application = await prisma.application.findUnique({ where: { id }, include: { payment: true } });
    if (!application) return res.status(404).json({ error: { message: 'Not found' } });
    
    const plan = await prisma.membershipPlan.findFirst({ where: { tier: application.tier } });
    if (!plan) return res.status(500).json({ error: { message: 'Plan not found' } });

    await prisma.$transaction(async (tx) => {
      await tx.application.update({
        where: { id },
        data: {
          status: 'APPROVED',
          reviewerId: req.user.id,
          reviewedAt: new Date(),
          assignedPosition: application.type === 'LEAD' ? application.desiredPosition : null
        }
      });

      const memberCode = 'MBR-' + Date.now();
      const qrToken = crypto.randomBytes(16).toString('hex');
      const expiry = new Date();
      expiry.setFullYear(expiry.getFullYear() + 1);

      await tx.membership.create({
        data: {
          userId: application.userId,
          membershipPlanId: plan.id,
          status: 'ACTIVE',
          startDate: new Date(),
          expiryDate: expiry,
          memberCode,
          qrToken
        }
      });

      if (application.type === 'LEAD') {
        await tx.roleAssignment.create({
          data: {
            userId: application.userId,
            role: 'VOLUNTEER',
            positionTitle: application.desiredPosition
          }
        });
      }
    });
    
    res.json({ message: 'Application approved' });
  } catch (error) { next(error); }
};

exports.rejectApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reviewNote } = req.body;

    const application = await prisma.application.findUnique({ where: { id }, include: { payment: true } });
    if (!application) return res.status(404).json({ error: { message: 'Not found' } });

    await prisma.$transaction(async (tx) => {
      await tx.application.update({
        where: { id },
        data: {
          status: 'REJECTED',
          reviewerId: req.user.id,
          reviewedAt: new Date(),
          reviewNote
        }
      });

      // Record refund in ledger
      if (application.payment) {
        await tx.ledgerEntry.create({
          data: {
            type: 'EXPENSE',
            category: 'EXPENSE',
            amount: application.payment.amount,
            description: 'Refund for rejected application',
            createdById: req.user.id
          }
        });
      }
    });

    res.json({ message: 'Application rejected and refunded' });
  } catch (error) { next(error); }
};
