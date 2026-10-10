const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../../lib/prisma');
const { env } = require('../../config/env');
const { getEffectiveRole, dashboardRoute } = require('../../services/role.service');
const { badRequest, unauthorized, forbidden, conflict } = require('../../lib/errors');
const asyncHandler = require('../../lib/asyncHandler');

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  };
}

function setAuthCookie(res, token) {
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, intent = 'GUEST', tier, skills, desiredPosition, notes } = req.body;

  if (!email || !password || !name) {
    throw badRequest('VALIDATION_ERROR', 'Name, email, and password are required');
  }

  if (password.length < 8) {
    throw badRequest('PASSWORD_TOO_SHORT', 'Password must be at least 8 characters');
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw conflict('EMAIL_EXISTS', 'An account with this email already exists');
  }

  const normalizedIntent = (intent || 'GUEST').toUpperCase();

  if (['MEMBER', 'LEAD'].includes(normalizedIntent)) {
    if (!skills || skills.trim().length < 5) {
      throw badRequest('SKILLS_REQUIRED', 'Skills must be at least 5 characters');
    }
    if (normalizedIntent === 'LEAD' && (!desiredPosition || desiredPosition === 'NONE')) {
      throw badRequest('POSITION_REQUIRED', 'A desired position is required for LEAD intent');
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    let application = null;
    if (normalizedIntent !== 'GUEST') {
      application = await tx.application.create({
        data: {
          userId: user.id,
          type: normalizedIntent,
          tier: tier || 'BASIC',
          skills: skills || '',
          desiredPosition: desiredPosition || 'NONE',
          notes: notes || null,
          status: 'PAYMENT_PENDING',
        },
      });
    }

    return { user, application };
  });

  const token = jwt.sign({ sub: result.user.id }, env.JWT_SECRET || 'change-me', {
    expiresIn: env.JWT_EXPIRES_IN || '7d',
  });

  setAuthCookie(res, token);
  const effective = await getEffectiveRole(result.user.id);
  const dashboard = dashboardRoute(effective);

  res.status(201).json({
    user: publicUser(result.user),
    effective,
    dashboard,
    token,
    application: result.application,
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw badRequest('VALIDATION_ERROR', 'Email and password are required');
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw unauthorized('INVALID_CREDENTIALS', 'Invalid email or password');
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw unauthorized('INVALID_CREDENTIALS', 'Invalid email or password');
  }

  const token = jwt.sign({ sub: user.id }, env.JWT_SECRET || 'change-me', {
    expiresIn: env.JWT_EXPIRES_IN || '7d',
  });

  setAuthCookie(res, token);
  const effective = await getEffectiveRole(user.id);
  const dashboard = dashboardRoute(effective);

  res.json({
    user: publicUser(user),
    effective,
    dashboard,
    token,
  });
});

exports.adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw badRequest('VALIDATION_ERROR', 'Email and password are required');
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw unauthorized('INVALID_CREDENTIALS', 'Invalid email or password');
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw unauthorized('INVALID_CREDENTIALS', 'Invalid email or password');
  }

  const effective = await getEffectiveRole(user.id);
  if (effective.role !== 'PRESIDENT') {
    throw forbidden('NOT_ADMIN', 'President administration credentials required');
  }

  const token = jwt.sign({ sub: user.id }, env.JWT_SECRET || 'change-me', {
    expiresIn: env.JWT_EXPIRES_IN || '7d',
  });

  setAuthCookie(res, token);

  res.json({
    user: publicUser(user),
    effective,
    dashboard: '/admin',
    token,
  });
});

exports.logout = asyncHandler(async (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

exports.me = asyncHandler(async (req, res) => {
  const effective = await getEffectiveRole(req.user.id);
  const dashboard = dashboardRoute(effective);

  res.json({
    user: publicUser(req.user),
    effective,
    dashboard,
  });
});
