const prisma = require('../../lib/prisma');
const { sendEmail } = require('../../lib/mailer');
const { getEffectiveRole } = require('../../services/role.service');

exports.getAnnouncements = async (req, res, next) => {
  try {
    let role = 'GUEST';
    
    // Attempt to parse auth if it exists, without strictly requiring it
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const jwt = require('jsonwebtoken');
      try {
        const decoded = jwt.verify(token, require('../../config/env').env.JWT_SECRET);
        const userRole = await getEffectiveRole(decoded.userId);
        role = userRole.role;
      } catch (e) { /* ignore */ }
    }

    const where = {};
    if (!['MEMBER', 'VOLUNTEER', 'VP_EVENTS', 'TREASURER', 'PRESIDENT'].includes(role)) {
      where.audience = 'PUBLIC';
    }

    const announcements = await prisma.announcement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { name: true } } }
    });
    res.json(announcements);
  } catch (error) { next(error); }
};

exports.createAnnouncement = async (req, res, next) => {
  try {
    const { title, content, audience } = req.body;
    
    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        audience: audience || 'PUBLIC',
        authorId: req.user.id
      }
    });

    if (audience === 'MEMBERS') {
      const members = await prisma.membership.findMany({
        where: { status: 'ACTIVE', expiryDate: { gt: new Date() } },
        include: { user: true }
      });
      members.forEach(m => {
        sendEmail(m.user.email, `Member Announcement: ${title}`, content);
      });
    }

    res.status(201).json(announcement);
  } catch (error) { next(error); }
};

exports.updateAnnouncement = async (req, res, next) => {
  try {
    const { id } = req.params;
    const announcement = await prisma.announcement.update({
      where: { id },
      data: req.body
    });
    res.json(announcement);
  } catch (error) { next(error); }
};
