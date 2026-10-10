const prisma = require('../../lib/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { env } = require('../../config/env');
const { getEffectiveRole } = require('../../services/role.service');

exports.register = async (req, res, next) => {
  try {
    const { email, password, name, type, desiredPosition, tier, skills, notes } = req.body;
    
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: { code: 'DUPLICATE', message: 'Email already exists' } });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      }
    });

    const application = await prisma.application.create({
      data: {
        userId: user.id,
        type: type || 'MEMBER',
        desiredPosition: desiredPosition || 'NONE',
        tier: tier || 'BASIC',
        skills: skills || '',
        notes
      }
    });

    res.status(201).json({ message: 'Registered', user: { id: user.id, email }, application });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } });
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } });
    
    const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, { expiresIn: '7d' });
    
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.status(200).json({ message: 'Logged in', token });
  } catch (error) {
    next(error);
  }
};

exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } });
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } });
    
    const { role } = await getEffectiveRole(user.id);
    if (role !== 'PRESIDENT') {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Admin access required' } });
    }

    const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ message: 'Logged in as Admin', token });
  } catch (error) {
    next(error);
  }
};

exports.me = async (req, res, next) => {
  try {
    const { role, positionTitle } = await getEffectiveRole(req.user.id);
    
    let dashboard = '/guest';
    switch (role) {
      case 'PRESIDENT': dashboard = '/admin'; break;
      case 'TREASURER': dashboard = '/treasurer'; break;
      case 'VP_EVENTS': dashboard = '/events-manager'; break;
      case 'VOLUNTEER': dashboard = '/volunteer'; break;
      case 'MEMBER': dashboard = '/member'; break;
      case 'UNDER_REVIEW': dashboard = '/application-status'; break;
      case 'AWAITING_PAYMENT': dashboard = '/pay'; break;
      case 'REJECTED': dashboard = '/application-status'; break;
    }

    res.status(200).json({
      user: { id: req.user.id, email: req.user.email, name: req.user.name },
      role,
      positionTitle,
      dashboard
    });
  } catch (error) {
    next(error);
  }
};
