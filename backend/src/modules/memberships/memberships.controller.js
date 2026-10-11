const prisma = require('../../lib/prisma');
const memberIdentityService = require('../../services/memberIdentity.service');
const asyncHandler = require('../../lib/asyncHandler');
const { unauthorized } = require('../../lib/errors');

const CLUB_MEMBERSHIP_PLANS = [
  {
    id: 'plan-guest',
    tier: 'GUEST',
    name: 'Guest Access',
    price: 0,
    feeDisplay: '₹0',
    type: 'FREE',
    description: 'Free public visitor access to explore Club_Hub events, notices, and shop.',
    features: [
      'Access to public website & events calendar',
      'Read official club notices and bulletins',
      'Browse official Club_Hub merchandise catalog',
      'Register for open public workshops',
    ],
    limitations: [
      'No official Club_Hub member status',
      'No digital student ID card or QR pass',
      'No member discounts on merch/tickets',
      'No club position application eligibility',
    ],
    cta: 'Continue as Guest',
    isPopular: false,
  },
  {
    id: 'plan-official',
    tier: 'MEMBER',
    name: 'Official Club Membership',
    price: 30000, // 30000 paise = ₹300
    feeDisplay: '₹300',
    type: 'ONE_TIME',
    merchDiscount: 20,
    description: 'One-time ₹300 joining fee. Full verified membership with perks & leadership eligibility.',
    features: [
      'One-time joining fee of ₹300 (No recurring renewal charges)',
      'Official Club_Hub membership (Subject to application review)',
      'Eligible for official Club_Hub goodies pack & Club T-shirt',
      'Digital Member ID Card with secure QR verification token',
      'Full access to member-only project teamwork & workspace',
      'Express interest in dynamic open club leadership positions',
      'Exclusive 20% discount on official merchandise & tickets',
      'Voting rights in club general meetings & student initiatives',
    ],
    cta: 'Apply for Membership — ₹300',
    isPopular: true,
  },
];

exports.getPlans = asyncHandler(async (req, res) => {
  res.json(CLUB_MEMBERSHIP_PLANS);
});

/**
 * GET /api/members/me/id-card & GET /api/memberships/card
 * Authenticated member retrieves digital ID card data and QR code
 */
exports.getIdCard = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    throw unauthorized('AUTH_REQUIRED', 'Please sign in to view your membership ID card.');
  }
  const card = await memberIdentityService.getMemberIdCard(req.user.id);
  res.json(card);
});

/**
 * GET /api/members/me/qr
 * Authenticated member retrieves their QR code and verification URL
 */
exports.getQr = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    throw unauthorized('AUTH_REQUIRED', 'Authentication required.');
  }
  const card = await memberIdentityService.getMemberIdCard(req.user.id);
  if (!card.hasActiveCard) {
    return res.status(403).json({
      active: false,
      message: card.message,
    });
  }
  res.json({
    active: true,
    memberCode: card.memberCode,
    qrToken: card.qrToken,
    qrCodeDataUrl: card.qrCodeDataUrl,
    verificationUrl: card.verificationUrl,
  });
});

/**
 * GET /api/members/verify/:token
 * Public QR code verification (minimal privacy-safe payload)
 */
exports.verifyPublic = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const result = await memberIdentityService.verifyMemberPublic(token);
  res.json(result);
});

/**
 * GET /api/members/staff/verify/:token
 * Staff-level verification for President, Admin, and Event Gate Staff
 */
exports.verifyStaff = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const result = await memberIdentityService.verifyMemberStaff(token, req.user);
  res.json(result);
});

/**
 * GET /api/members & GET /api/memberships
 * Returns all real registered members from PostgreSQL database
 */
exports.getAllMembers = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const where = {};
  if (search) {
    where.OR = [
      { memberCode: { contains: search, mode: 'insensitive' } },
      { user: { name: { contains: search, mode: 'insensitive' } } },
      { user: { email: { contains: search, mode: 'insensitive' } } },
    ];
  }

  const memberships = await prisma.membership.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          applications: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            select: { notes: true, desiredPosition: true, assignedPosition: true, status: true },
          },
        },
      },
      membershipPlan: true,
    },
  });

  const formatted = memberships.map((m) => {
    let positions = [];
    const latestApp = m.user?.applications?.[0];
    if (latestApp?.assignedPosition) {
      positions = [latestApp.assignedPosition];
    } else if (latestApp?.notes) {
      try {
        const parsed = JSON.parse(latestApp.notes);
        if (parsed.approvedPositions && parsed.approvedPositions.length > 0) {
          positions = parsed.approvedPositions;
        } else if (parsed.selectedPositions && parsed.selectedPositions.length > 0) {
          positions = parsed.selectedPositions;
        }
      } catch {}
    }
    if (positions.length === 0) positions = ['General Member'];

    return {
      id: m.id,
      userId: m.userId,
      name: m.user?.name || 'Club Member',
      email: m.user?.email || '',
      memberCode: m.memberCode,
      tier: m.membershipPlan?.name || 'Official (₹300)',
      status: m.status,
      positions,
      startDate: m.startDate,
      expiryDate: m.expiryDate,
      duesPaid: m.status === 'ACTIVE',
      qrToken: m.qrToken,
    };
  });

  res.json({
    success: true,
    members: formatted,
    total: formatted.length,
  });
});

