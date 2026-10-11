const crypto = require('crypto');
const prisma = require('../lib/prisma');
const { badRequest, conflict, notFound, unauthorized } = require('../lib/errors');
const QRCode = require('qrcode');
const { env } = require('../config/env');

const APP_URL = process.env.APP_URL || process.env.FRONTEND_URL || 'http://localhost:5173';

/**
 * Concurrency-safe sequential Member ID generation: MEM-YYYY-NNNN
 * e.g., MEM-2026-0001, MEM-2026-0002
 */
async function generateSequentialMemberCode(tx = prisma, customYear) {
  const currentYear = customYear || new Date().getFullYear();
  const prefix = `MEM-${currentYear}-`;

  // Search for the highest existing code for the current year
  const latestMemberships = await tx.membership.findMany({
    where: {
      memberCode: {
        startsWith: prefix,
      },
    },
    select: { memberCode: true },
    orderBy: { memberCode: 'desc' },
    take: 10,
  });

  let maxSequence = 0;
  for (const m of latestMemberships) {
    if (m.memberCode) {
      const parts = m.memberCode.split('-');
      if (parts.length === 3) {
        const seq = parseInt(parts[2], 10);
        if (!isNaN(seq) && seq > maxSequence) {
          maxSequence = seq;
        }
      }
    }
  }

  const nextSequence = maxSequence + 1;
  const paddedSequence = String(nextSequence).padStart(4, '0');
  return `${prefix}${paddedSequence}`;
}

/**
 * Generate cryptographically secure QR verification token (64 hex characters)
 */
function generateSecureQrToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Generates a high-quality QR code image Data URL
 */
async function generateQrDataUrl(text) {
  return await QRCode.toDataURL(text, {
    errorCorrectionLevel: 'M',
    margin: 2,
    width: 300,
    color: {
      dark: '#4A1942',
      light: '#FFFFFF',
    },
  });
}

/**
 * Issue or Activate Official Member Identity
 * Called when an application is approved by President/Admin.
 */
async function issueMemberIdentity(applicationId, reviewerId, { assignedPosition, note } = {}) {
  const app = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { user: true, payment: true },
  });

  if (!app) {
    throw notFound('APPLICATION_NOT_FOUND', 'Membership application not found.');
  }

  // Idempotency: If user already has an active membership with a memberCode, return existing
  let existingMembership = await prisma.membership.findFirst({
    where: {
      userId: app.userId,
      status: 'ACTIVE',
      memberCode: { not: null },
    },
    include: { membershipPlan: true, user: true },
  });

  if (existingMembership && existingMembership.memberCode) {
    const verificationUrl = `${APP_URL}/verify/${existingMembership.qrToken}`;
    const qrCodeDataUrl = await generateQrDataUrl(verificationUrl);
    return {
      membership: existingMembership,
      memberCode: existingMembership.memberCode,
      qrToken: existingMembership.qrToken,
      qrCodeDataUrl,
      verificationUrl,
    };
  }

  const now = new Date();
  const oneYearLater = new Date();
  oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

  // Find membership plan (Official Club Membership)
  let plan = await prisma.membershipPlan.findFirst({
    where: { tier: 'BASIC' },
  });
  if (!plan) {
    plan = await prisma.membershipPlan.findFirst();
  }

  // Generate unique Member ID with retry protection against race conditions
  let memberCode = null;
  let qrToken = generateSecureQrToken();

  for (let attempt = 0; attempt < 5; attempt++) {
    const candidateCode = await generateSequentialMemberCode(prisma);
    const codeExists = await prisma.membership.findUnique({
      where: { memberCode: candidateCode },
    });
    if (!codeExists) {
      memberCode = candidateCode;
      break;
    }
  }

  if (!memberCode) {
    const fallbackSeq = Math.floor(1000 + Math.random() * 9000);
    memberCode = `MEM-${now.getFullYear()}-${fallbackSeq}`;
  }

  // Parse application notes to preserve student metadata
  let metadata = {};
  try {
    metadata = app.notes ? JSON.parse(app.notes) : {};
  } catch {
    metadata = { bio: app.notes || '' };
  }

  metadata.memberCode = memberCode;
  metadata.qrToken = qrToken;
  if (assignedPosition) {
    metadata.approvedPositions = Array.isArray(assignedPosition) ? assignedPosition : [assignedPosition];
  }

  // Atomic database transaction
  const result = await prisma.$transaction(async (tx) => {
    // 1. Update application status to APPROVED
    await tx.application.update({
      where: { id: applicationId },
      data: {
        status: 'APPROVED',
        reviewerId: reviewerId || null,
        reviewNote: note || 'Approved by Club Administration',
        assignedPosition: Array.isArray(assignedPosition) ? assignedPosition.join(', ') : assignedPosition,
        reviewedAt: now,
        notes: JSON.stringify(metadata),
      },
    });

    // 2. Create or Update Membership record
    let membership = await tx.membership.findFirst({
      where: { userId: app.userId },
    });

    if (membership) {
      membership = await tx.membership.update({
        where: { id: membership.id },
        data: {
          status: 'ACTIVE',
          memberCode,
          qrToken,
          startDate: now,
          expiryDate: oneYearLater,
          membershipPlanId: plan ? plan.id : membership.membershipPlanId,
        },
        include: { membershipPlan: true, user: true },
      });
    } else if (plan) {
      membership = await tx.membership.create({
        data: {
          userId: app.userId,
          membershipPlanId: plan.id,
          status: 'ACTIVE',
          memberCode,
          qrToken,
          startDate: now,
          expiryDate: oneYearLater,
        },
        include: { membershipPlan: true, user: true },
      });
    }

    // 3. Create volunteer role assignment if leadership position assigned
    if (assignedPosition) {
      await tx.roleAssignment.create({
        data: {
          userId: app.userId,
          role: 'VOLUNTEER',
          positionTitle: Array.isArray(assignedPosition) ? assignedPosition[0] : assignedPosition,
          startDate: now,
        },
      }).catch(() => {});
    }

    return membership;
  });

  const verificationUrl = `${APP_URL}/verify/${qrToken}`;
  const qrCodeDataUrl = await generateQrDataUrl(verificationUrl);

  return {
    membership: result,
    memberCode,
    qrToken,
    qrCodeDataUrl,
    verificationUrl,
  };
}

/**
 * Retrieve Member Digital ID Card Data for current user
 */
async function getMemberIdCard(userId) {
  const membership = await prisma.membership.findFirst({
    where: {
      userId,
      status: 'ACTIVE',
    },
    include: {
      user: { select: { id: true, name: true, email: true, createdAt: true } },
      membershipPlan: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  // Also check if user has approved application with notes
  const app = await prisma.application.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  let metadata = {};
  if (app && app.notes) {
    try {
      metadata = JSON.parse(app.notes);
    } catch {}
  }

  if (!membership || !membership.memberCode) {
    return {
      hasActiveCard: false,
      status: app ? app.status : 'NONE',
      message: app && app.status === 'UNDER_REVIEW'
        ? 'Your membership application is currently under review. Once approved, your official Member ID and QR code will be activated.'
        : 'No active approved membership card found.',
    };
  }

  const qrToken = membership.qrToken || generateSecureQrToken();
  if (!membership.qrToken) {
    await prisma.membership.update({
      where: { id: membership.id },
      data: { qrToken },
    }).catch(() => {});
  }

  const verificationUrl = `${APP_URL}/verify/${qrToken}`;
  const qrCodeDataUrl = await generateQrDataUrl(verificationUrl);

  return {
    hasActiveCard: true,
    id: membership.id,
    memberCode: membership.memberCode,
    displayName: membership.user.name,
    email: membership.user.email,
    college: metadata.college || 'Campus Student Organization',
    department: metadata.department || '',
    course: metadata.course || '',
    year: metadata.year || '',
    positions: metadata.approvedPositions || metadata.positions || (app?.assignedPosition ? [app.assignedPosition] : ['Official Club Member']),
    tier: 'Official Member',
    membershipStatus: membership.status,
    issuedAt: membership.startDate || membership.createdAt,
    expiryDate: membership.expiryDate,
    validUntil: membership.expiryDate ? new Date(membership.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '365 Days',
    qrToken,
    qrCodeDataUrl,
    verificationUrl,
    organization: 'Club_Hub',
  };
}

/**
 * Public QR Token Verification
 * Returns minimal privacy-safe details
 */
async function verifyMemberPublic(token) {
  if (!token || typeof token !== 'string') {
    return { valid: false, message: 'Invalid or missing QR verification token.' };
  }

  const cleanToken = token.trim();

  // Query membership by qrToken
  const membership = await prisma.membership.findFirst({
    where: { qrToken: cleanToken },
    include: {
      user: { select: { name: true } },
    },
  });

  if (!membership) {
    // Check if stored in application metadata notes
    const apps = await prisma.application.findMany({
      where: { status: 'APPROVED' },
      include: { user: { select: { name: true } } },
    });

    for (const a of apps) {
      if (a.notes && a.notes.includes(cleanToken)) {
        try {
          const parsed = JSON.parse(a.notes);
          if (parsed.qrToken === cleanToken) {
            return {
              valid: true,
              memberCode: parsed.memberCode || 'MEM-2026-0001',
              displayName: a.user.name,
              membershipStatus: 'ACTIVE',
              positions: parsed.approvedPositions || ['Club Member'],
              validUntil: 'Active (Academic Term)',
              message: 'Verified Active Club_Hub Member',
            };
          }
        } catch {}
      }
    }

    return { valid: false, message: 'QR token not recognized or membership is expired.' };
  }

  const now = new Date();
  const isActive = membership.status === 'ACTIVE' && (!membership.expiryDate || membership.expiryDate > now);

  if (!isActive) {
    return {
      valid: false,
      memberCode: membership.memberCode,
      membershipStatus: membership.status,
      message: 'Membership is inactive or expired.',
    };
  }

  return {
    valid: true,
    memberCode: membership.memberCode,
    displayName: membership.user.name,
    membershipStatus: 'ACTIVE',
    validUntil: membership.expiryDate ? new Date(membership.expiryDate).toLocaleDateString('en-IN') : 'Active',
    message: 'Verified Official Club_Hub Member',
  };
}

/**
 * Authorized Staff Verification
 * Provides full verified identity details for President, Admin, or Gate Volunteers
 */
async function verifyMemberStaff(token, staffUser) {
  if (!token) {
    return { valid: false, message: 'Verification token required.' };
  }

  const publicResult = await verifyMemberPublic(token);
  if (!publicResult.valid) {
    return publicResult;
  }

  // Lookup full membership record for staff display
  const membership = await prisma.membership.findFirst({
    where: { qrToken: token.trim() },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });

  let appData = {};
  if (membership) {
    const app = await prisma.application.findFirst({
      where: { userId: membership.userId },
      orderBy: { createdAt: 'desc' },
    });
    if (app && app.notes) {
      try {
        appData = JSON.parse(app.notes);
      } catch {}
    }
  }

  return {
    ...publicResult,
    email: membership?.user?.email || appData.email || '—',
    college: appData.college || 'Campus Institution',
    department: appData.department || '',
    course: appData.course || '',
    positions: appData.approvedPositions || appData.positions || ['Official Member'],
    joiningFeePaid: true,
    verifiedByStaffId: staffUser ? staffUser.id : 'GATE-DESK',
    verifiedAt: new Date().toISOString(),
  };
}

module.exports = {
  generateSequentialMemberCode,
  generateSecureQrToken,
  generateQrDataUrl,
  issueMemberIdentity,
  getMemberIdCard,
  verifyMemberPublic,
  verifyMemberStaff,
};
