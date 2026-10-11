const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const applicationService = require('../../services/application.service');
const paymentService = require('../../services/payment.service');
const prisma = require('../../lib/prisma');
const { env } = require('../../config/env');
const { notFound, badRequest, conflict } = require('../../lib/errors');
const asyncHandler = require('../../lib/asyncHandler');
const { createGatewayOrder, verifySignature } = require('../../lib/razorpay');

/**
 * Public Multi-Step Onboarding Endpoint:
 * Collects applicant info, validates fields, creates user + pending application,
 * and creates a real Razorpay Order for exactly ₹300 (30000 paise).
 */
exports.publicOnboard = asyncHandler(async (req, res) => {
  const {
    fullName,
    name,
    email,
    phone,
    college,
    course,
    year,
    department,
    bio,
    skills,
    linkedinUrl,
    portfolioUrl,
    githubUrl,
    selectedPositions,
    positions,
    password,
  } = req.body;

  const applicantName = (fullName || name || '').trim();
  const cleanEmail = (email || '').trim().toLowerCase();

  if (!applicantName || !cleanEmail) {
    throw badRequest('NAME_EMAIL_REQUIRED', 'Full name and email address are required.');
  }

  const cleanName = applicantName;
  const positionsArray = Array.isArray(selectedPositions)
    ? selectedPositions
    : Array.isArray(positions)
    ? positions
    : [];

  // Basic Indian mobile phone validation if supplied
  if (phone && !/^[6-9]\d{9}$/.test(phone.replace(/\D/g, '').slice(-10))) {
    throw badRequest('INVALID_PHONE', 'Please enter a valid 10-digit mobile number.');
  }

  // URL validation for LinkedIn / Portfolio
  const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
  if (linkedinUrl && !urlRegex.test(linkedinUrl.trim())) {
    throw badRequest('INVALID_LINKEDIN', 'Please enter a valid LinkedIn URL.');
  }
  if (portfolioUrl && !urlRegex.test(portfolioUrl.trim())) {
    throw badRequest('INVALID_PORTFOLIO', 'Please enter a valid portfolio/GitHub URL.');
  }

  // Find or create User
  let user = await prisma.user.findUnique({ where: { email: cleanEmail } });
  if (!user) {
    const rawPass = password && password.length >= 6 ? password : `ClubHub@${Date.now().toString().slice(-4)}`;
    const hashedPassword = await bcrypt.hash(rawPass, 10);
    user = await prisma.user.create({
      data: {
        name: cleanName,
        email: cleanEmail,
        password: hashedPassword,
      },
    });
  }

  // Check if user already has an active or under-review application
  const existingApp = await prisma.application.findFirst({
    where: {
      userId: user.id,
      status: { in: ['UNDER_REVIEW', 'APPROVED'] },
    },
  });
  if (existingApp && existingApp.status === 'APPROVED') {
    throw conflict('ALREADY_MEMBER', 'You already have an active approved Club_Hub membership.');
  }
  if (existingApp && existingApp.status === 'UNDER_REVIEW') {
    throw conflict('UNDER_REVIEW', 'Your membership application is currently under review by club administration.');
  }

  // Package detailed metadata into notes JSON
  const applicationMetadata = {
    fullName: cleanName,
    email: cleanEmail,
    phone: phone || '',
    college: college || 'Campus Institution',
    course: course || '',
    year: year || '',
    department: department || '',
    bio: bio || '',
    skills: skills || '',
    linkedinUrl: linkedinUrl || '',
    portfolioUrl: portfolioUrl || githubUrl || '',
    selectedPositions: positionsArray,
    amountPaidPaise: 30000,
    feeDisplay: '₹300 (One-Time Joining Fee)',
  };

  const primaryPosition = positionsArray.length > 0 ? positionsArray[0] : 'General Member';

  // 1. Create or Update pending Application
  let application = await prisma.application.findFirst({
    where: { userId: user.id, status: 'PAYMENT_PENDING' },
  });

  if (application) {
    application = await prisma.application.update({
      where: { id: application.id },
      data: {
        skills: skills || 'Standard Club Membership',
        notes: JSON.stringify(applicationMetadata),
        type: positionsArray.length > 0 ? 'LEAD' : 'MEMBER',
      },
    });
  } else {
    application = await prisma.application.create({
      data: {
        userId: user.id,
        type: positionsArray.length > 0 ? 'LEAD' : 'MEMBER',
        tier: 'BASIC',
        skills: skills || 'Standard Club Membership',
        notes: JSON.stringify(applicationMetadata),
        status: 'PAYMENT_PENDING',
      },
    });
  }

  // 2. Create Razorpay Gateway Order for exactly ₹300 (30000 paise)
  const order = await paymentService.createOrder({
    purpose: 'DUES',
    amount: 30000, // 30000 paise = ₹300
    userId: user.id,
    meta: {
      applicationId: application.id,
      applicantName: cleanName,
      applicantEmail: cleanEmail,
    },
  });

  // Link payment ID to application
  await prisma.application.update({
    where: { id: application.id },
    data: { paymentId: order.paymentId },
  });

  // Generate JWT token for seamless session
  const token = jwt.sign({ sub: user.id }, env.JWT_SECRET || 'clubhub-super-secret-jwt-key-2026', {
    expiresIn: '7d',
  });

  res.status(201).json({
    applicationId: application.id,
    orderId: order.gatewayOrderId,
    paymentId: order.paymentId,
    amount: 30000,
    amountFormatted: '₹300',
    currency: 'INR',
    key: order.keyId || env.RAZORPAY_KEY_ID || 'rzp_test_TmPB80JLFGV93g',
    application: {
      id: application.id,
      status: application.status,
      metadata: applicationMetadata,
    },
    order: {
      paymentId: order.paymentId,
      gatewayOrderId: order.gatewayOrderId,
      amount: 30000,
      amountFormatted: '₹300',
      currency: 'INR',
      keyId: order.keyId || env.RAZORPAY_KEY_ID || 'rzp_test_TmPB80JLFGV93g',
      applicantName: cleanName,
      applicantEmail: cleanEmail,
      applicantPhone: phone || '',
    },
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

/**
 * Verify Razorpay Payment & Transition to UNDER_REVIEW
 */
exports.verifyOnboard = asyncHandler(async (req, res) => {
  const {
    applicationId,
    gatewayOrderId,
    razorpay_order_id,
    orderId,
    gatewayPaymentId,
    razorpay_payment_id,
    paymentId,
    signature,
    razorpay_signature,
  } = req.body;

  const actualOrderId = gatewayOrderId || razorpay_order_id || orderId;
  const actualPaymentId = gatewayPaymentId || razorpay_payment_id || paymentId || `pay_test_${Date.now()}`;
  const actualSignature = signature || razorpay_signature || 'mock_signature';

  if (!actualOrderId) {
    throw badRequest('ORDER_ID_REQUIRED', 'Gateway order reference is required.');
  }

  // Confirm payment & create ledger entry
  const result = await paymentService.confirmPayment({
    gatewayOrderId: actualOrderId,
    gatewayPaymentId: actualPaymentId,
    signature: actualSignature,
    actorId: req.user ? req.user.id : undefined,
  });

  // If applicationId was passed, ensure it is set to UNDER_REVIEW
  if (applicationId) {
    await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: 'UNDER_REVIEW',
        submittedAt: new Date(),
      },
    }).catch(() => {});
  }

  res.json({
    success: true,
    message: 'Your Club_Hub membership application and payment have been received successfully. Your application is now awaiting administrative review. Our club administration aims to review your information within one working day.',
    ...result,
  });
});

/**
 * Public Status Tracking by Application ID
 */
exports.getStatusById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const app = await prisma.application.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      payment: true,
      reviewer: { select: { name: true } },
    },
  });

  if (!app) {
    throw notFound('APPLICATION_NOT_FOUND', 'Application record not found.');
  }

  let metadata = {};
  try {
    metadata = app.notes ? JSON.parse(app.notes) : {};
  } catch {
    metadata = { notes: app.notes };
  }

  res.json({
    id: app.id,
    status: app.status,
    type: app.type,
    tier: app.tier,
    assignedPosition: app.assignedPosition,
    submittedAt: app.submittedAt,
    reviewedAt: app.reviewedAt,
    reviewNote: app.reviewNote,
    user: app.user,
    payment: app.payment ? {
      amount: app.payment.amount,
      status: app.payment.status,
      orderId: app.payment.orderId,
      paidAt: app.payment.updatedAt,
    } : null,
    metadata,
  });
});

/**
 * Standard Member Authenticated Handlers
 */
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

  const order = await paymentService.createOrder({
    purpose: 'DUES',
    amount: 30000, // ₹300 standard one-time fee
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

/**
 * Admin & Treasurer Endpoints
 */
exports.listAdminApplications = asyncHandler(async (req, res) => {
  const { status, search, position } = req.query;
  const where = {};
  if (status && status !== 'ALL') {
    where.status = status;
  }

  const applications = await prisma.application.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { id: true, name: true, email: true } },
      payment: true,
      reviewer: { select: { id: true, name: true, email: true } },
    },
  });

  // Enrich with parsed metadata
  const enriched = applications.map((app) => {
    let metadata = {};
    try {
      metadata = app.notes ? JSON.parse(app.notes) : {};
    } catch {
      metadata = { bio: app.notes };
    }
    return {
      ...app,
      metadata,
      phone: metadata.phone || '',
      college: metadata.college || 'Campus Institution',
      course: metadata.course || '',
      year: metadata.year || '',
      department: metadata.department || '',
      bio: metadata.bio || '',
      linkedinUrl: metadata.linkedinUrl || '',
      portfolioUrl: metadata.portfolioUrl || '',
      selectedPositions: metadata.selectedPositions || (app.desiredPosition !== 'NONE' ? [app.desiredPosition] : ['General Member']),
    };
  });

  // Filter in memory if search or position filter is applied
  let filtered = enriched;
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(
      (a) =>
        a.user.name.toLowerCase().includes(s) ||
        a.user.email.toLowerCase().includes(s) ||
        a.metadata.phone?.includes(s) ||
        a.metadata.college?.toLowerCase().includes(s)
    );
  }
  if (position && position !== 'ALL') {
    filtered = filtered.filter((a) =>
      a.selectedPositions.some((p) => p.toLowerCase().includes(position.toLowerCase()))
    );
  }

  res.json({
    count: filtered.length,
    applications: filtered,
  });
});

exports.adminGetMetrics = asyncHandler(async (req, res) => {
  const [
    totalApplications,
    pendingReview,
    paymentVerified,
    approvedMembers,
    rejectedApplications,
    paidPayments,
    recentApplications,
  ] = await Promise.all([
    prisma.application.count(),
    prisma.application.count({ where: { status: 'UNDER_REVIEW' } }),
    prisma.payment.count({ where: { purpose: 'DUES', status: 'PAID' } }),
    prisma.application.count({ where: { status: 'APPROVED' } }),
    prisma.application.count({ where: { status: 'REJECTED' } }),
    prisma.payment.aggregate({
      where: { purpose: 'DUES', status: 'PAID' },
      _sum: { amount: true },
    }),
    prisma.application.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        payment: true,
      },
    }),
  ]);

  const verifiedRevenuePaise = paidPayments._sum.amount || 0;
  const verifiedRevenueRupees = Math.round(verifiedRevenuePaise / 100);

  res.json({
    totalApplications,
    pendingReview,
    paymentVerified,
    approvedMembers,
    rejectedApplications,
    verifiedRevenuePaise,
    verifiedRevenueRupees,
    feePerMember: 300,
    recentApplications,
  });
});

exports.adminApprove = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { assignedPosition, note } = req.body;
  const result = await applicationService.approveApplication(id, req.user.id, {
    assignedPosition,
    note,
  });
  res.json({
    success: true,
    message: 'Application approved and member account activated successfully.',
    application: result,
  });
});

exports.adminReject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { note } = req.body;
  if (!note) {
    throw badRequest('NOTE_REQUIRED', 'Please provide a reason for rejecting this application.');
  }
  const result = await applicationService.rejectApplication(id, req.user.id, { note });
  res.json({
    success: true,
    message: 'Application rejected.',
    application: result,
  });
});

