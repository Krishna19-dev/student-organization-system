const prisma = require('../../lib/prisma');

exports.electOfficer = async (req, res, next) => {
  try {
    const { userId, role } = req.body;
    
    if (!['VP_EVENTS', 'TREASURER'].includes(role)) {
      return res.status(400).json({ error: { message: 'Can only elect VP_EVENTS or TREASURER' } });
    }

    const membership = await prisma.membership.findFirst({
      where: { userId, status: 'ACTIVE', expiryDate: { gt: new Date() } }
    });

    if (!membership) {
      return res.status(400).json({ error: { message: 'Candidate must be an active member' } });
    }

    await prisma.$transaction(async (tx) => {
      // End the term of the current holder
      const currentHolders = await tx.roleAssignment.findMany({
        where: { role, endDate: null }
      });
      
      for (const holder of currentHolders) {
        await tx.roleAssignment.update({
          where: { id: holder.id },
          data: { endDate: new Date() }
        });
      }

      // Create new assignment
      await tx.roleAssignment.create({
        data: {
          userId,
          role,
          startDate: new Date()
        }
      });

      // Write audit log
      await tx.auditLog.create({
        data: {
          actorId: req.user.id,
          action: `ELECTED_${role}`,
          targetId: userId,
          target: 'User'
        }
      });
    });

    res.json({ message: 'Election successful. Old officer access revoked.' });
  } catch (error) { next(error); }
};

exports.getRoles = async (req, res, next) => {
  try {
    const assignments = await prisma.roleAssignment.findMany({
      include: { user: true },
      orderBy: { startDate: 'desc' }
    });
    res.json(assignments);
  } catch (error) { next(error); }
};
