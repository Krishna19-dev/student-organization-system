const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const prisma = require('../lib/prisma');
const { getEffectiveRole } = require('../services/role.service');
const { unauthorized } = require('../lib/errors');

function extractToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  return null;
}

const requireAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return next(unauthorized('UNAUTHORIZED', 'Authentication token required'));
    }

    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET || 'change-me');
    } catch (err) {
      return next(unauthorized('INVALID_TOKEN', 'Token is expired or invalid'));
    }

    const userId = decoded.sub || decoded.userId;
    if (!userId) {
      return next(unauthorized('INVALID_TOKEN', 'Invalid token claims'));
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return next(unauthorized('USER_NOT_FOUND', 'User does not exist'));
    }

    req.user = user;
    req.effective = await getEffectiveRole(user.id);
    next();
  } catch (error) {
    next(error);
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      req.user = null;
      req.effective = { role: 'GUEST', status: 'NONE', positionTitle: null };
      return next();
    }

    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET || 'change-me');
    } catch (err) {
      req.user = null;
      req.effective = { role: 'GUEST', status: 'NONE', positionTitle: null };
      return next();
    }

    const userId = decoded.sub || decoded.userId;
    if (!userId) {
      req.user = null;
      req.effective = { role: 'GUEST', status: 'NONE', positionTitle: null };
      return next();
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      req.user = null;
      req.effective = { role: 'GUEST', status: 'NONE', positionTitle: null };
      return next();
    }

    req.user = user;
    req.effective = await getEffectiveRole(user.id);
    next();
  } catch (error) {
    req.user = null;
    req.effective = { role: 'GUEST', status: 'NONE', positionTitle: null };
    next();
  }
};

module.exports = {
  requireAuth,
  optionalAuth,
};
