const { getEffectiveRole } = require('../services/role.service');
const { unauthorized, forbidden } = require('../lib/errors');

const requireRole = (...roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return next(unauthorized('UNAUTHORIZED', 'Not authenticated'));
      }

      if (!req.effective) {
        req.effective = await getEffectiveRole(req.user.id);
      }

      const role = req.effective.role;

      // President can do everything
      if (role === 'PRESIDENT' || roles.includes(role)) {
        return next();
      }

      return next(forbidden('FORBIDDEN', `Role required: ${roles.join(', ')}`));
    } catch (error) {
      next(error);
    }
  };
};

const requireActiveMember = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(unauthorized('UNAUTHORIZED', 'Not authenticated'));
    }

    if (!req.effective) {
      req.effective = await getEffectiveRole(req.user.id);
    }

    const memberRoles = ['MEMBER', 'VOLUNTEER', 'TREASURER', 'PRESIDENT'];
    if (memberRoles.includes(req.effective.role) && req.effective.status === 'ACTIVE') {
      return next();
    }

    return next(forbidden('FORBIDDEN', 'Active membership required'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  requireRole,
  requireActiveMember,
};
