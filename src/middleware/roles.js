const { getEffectiveRole } = require('../services/role.service');

const requireRole = (...roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
      }
      
      const { role } = await getEffectiveRole(req.user.id);
      
      // Admin (President) can do everything
      if (role === 'PRESIDENT' || roles.includes(role)) {
        req.effectiveRole = role;
        return next();
      }
      
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Insufficient permissions' } });
    } catch (error) {
      next(error);
    }
  };
};

const requireActiveMember = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
    }
    const { role } = await getEffectiveRole(req.user.id);
    
    // Any role from MEMBER up implies an active membership implicitly, EXCEPT guest/pending.
    // However, volunteers/VP/President are technically members too. 
    // Wait, let's just use requireRole with all upper roles.
    if (['MEMBER', 'VOLUNTEER', 'VP_EVENTS', 'TREASURER', 'PRESIDENT'].includes(role)) {
      req.effectiveRole = role;
      return next();
    }
    
    return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Active membership required' } });
  } catch (error) {
    next(error);
  }
};

module.exports = { requireRole, requireActiveMember };
