const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Membership Plans
  const basicPlan = await prisma.membershipPlan.upsert({
    where: { tier: 'BASIC' },
    update: {},
    create: { tier: 'BASIC', price: 50000, merchDiscount: 10 }
  });
  const premiumPlan = await prisma.membershipPlan.upsert({
    where: { tier: 'PREMIUM' },
    update: {},
    create: { tier: 'PREMIUM', price: 100000, merchDiscount: 20 }
  });
  console.log('✅ Plans created');

  const hash = (p) => bcrypt.hashSync(p, 10);

  // 2. President (seeded admin)
  const president = await prisma.user.upsert({
    where: { email: 'president@skyline.test' },
    update: {},
    create: { email: 'president@skyline.test', name: 'Arjun Mehta', password: hash('admin123') }
  });
  await prisma.roleAssignment.upsert({
    where: { id: 'seed-president-role' },
    update: {},
    create: { id: 'seed-president-role', userId: president.id, role: 'PRESIDENT' }
  });

  // 3. Treasurer
  const treasurer = await prisma.user.upsert({
    where: { email: 'treasurer@skyline.test' },
    update: {},
    create: { email: 'treasurer@skyline.test', name: 'Priya Sharma', password: hash('treasurer123') }
  });
  await prisma.roleAssignment.upsert({
    where: { id: 'seed-treasurer-role' },
    update: {},
    create: { id: 'seed-treasurer-role', userId: treasurer.id, role: 'TREASURER' }
  });
  await prisma.membership.upsert({
    where: { memberCode: 'MBR-TREASURER' },
    update: {},
    create: {
      userId: treasurer.id, membershipPlanId: premiumPlan.id,
      status: 'ACTIVE', startDate: new Date(),
      expiryDate: new Date(Date.now() + 365 * 86400 * 1000),
      memberCode: 'MBR-TREASURER', qrToken: crypto.randomBytes(16).toString('hex')
    }
  });

  // 5. Volunteer (Technical Lead)
  const volunteer = await prisma.user.upsert({
    where: { email: 'volunteer@skyline.test' },
    update: {},
    create: { email: 'volunteer@skyline.test', name: 'Sneha Nair', password: hash('volunteer123') }
  });
  await prisma.roleAssignment.upsert({
    where: { id: 'seed-vol-role' },
    update: {},
    create: { id: 'seed-vol-role', userId: volunteer.id, role: 'VOLUNTEER', positionTitle: 'Technical Lead' }
  });
  await prisma.membership.upsert({
    where: { memberCode: 'MBR-VOL' },
    update: {},
    create: {
      userId: volunteer.id, membershipPlanId: basicPlan.id,
      status: 'ACTIVE', startDate: new Date(),
      expiryDate: new Date(Date.now() + 365 * 86400 * 1000),
      memberCode: 'MBR-VOL', qrToken: crypto.randomBytes(16).toString('hex')
    }
  });

  // 6. Regular Members (3)
  for (let i = 1; i <= 3; i++) {
    const m = await prisma.user.upsert({
      where: { email: `member${i}@skyline.test` },
      update: {},
      create: { email: `member${i}@skyline.test`, name: `Member ${i}`, password: hash('member123') }
    });
    await prisma.membership.upsert({
      where: { memberCode: `MBR-00${i}` },
      update: {},
      create: {
        userId: m.id, membershipPlanId: basicPlan.id,
        status: 'ACTIVE', startDate: new Date(),
        expiryDate: new Date(Date.now() + 365 * 86400 * 1000),
        memberCode: `MBR-00${i}`, qrToken: crypto.randomBytes(16).toString('hex')
      }
    });
  }

  // 7. Expired Member
  const expired = await prisma.user.upsert({
    where: { email: 'expired@skyline.test' },
    update: {},
    create: { email: 'expired@skyline.test', name: 'Expired User', password: hash('expired123') }
  });
  await prisma.membership.upsert({
    where: { memberCode: 'MBR-EXP' },
    update: {},
    create: {
      userId: expired.id, membershipPlanId: basicPlan.id,
      status: 'EXPIRED', startDate: new Date('2024-01-01'),
      expiryDate: new Date('2025-01-01'),
      memberCode: 'MBR-EXP', qrToken: crypto.randomBytes(16).toString('hex')
    }
  });

  // 8. Applicant Under Review
  const applicant = await prisma.user.upsert({
    where: { email: 'applicant@skyline.test' },
    update: {},
    create: { email: 'applicant@skyline.test', name: 'Karan Verma', password: hash('applicant123') }
  });
  const appPayment = await prisma.payment.create({
    data: { userId: applicant.id, amount: 50000, purpose: 'DUES', status: 'PAID', orderId: 'seed_app_order' }
  });
  await prisma.application.create({
    data: {
      userId: applicant.id, type: 'LEAD', desiredPosition: 'TECHNICAL_LEAD',
      tier: 'BASIC', skills: 'React, Node.js, PostgreSQL',
      status: 'UNDER_REVIEW', paymentId: appPayment.id, submittedAt: new Date()
    }
  });
  await prisma.ledgerEntry.create({
    data: { type: 'INCOME', category: 'DUES', amount: 50000, paymentId: appPayment.id }
  });

  console.log('✅ Users seeded');

  // 9. Events
  const upcomingGala = await prisma.event.upsert({
    where: { id: 'seed-event-gala' },
    update: {},
    create: {
      id: 'seed-event-gala',
      title: 'Spring Gala 2026', venue: 'Main Auditorium',
      date: new Date(Date.now() + 14 * 86400 * 1000),
      totalSeats: 100, seatsSold: 80,
      memberPrice: 10000, guestPrice: 20000
    }
  });
  const soldOut = await prisma.event.upsert({
    where: { id: 'seed-event-soldout' },
    update: {},
    create: {
      id: 'seed-event-soldout',
      title: 'Tech Meetup (Sold Out)', venue: 'Room 301',
      date: new Date(Date.now() + 7 * 86400 * 1000),
      totalSeats: 50, seatsSold: 50,
      memberPrice: 5000, guestPrice: 10000
    }
  });
  console.log('✅ Events seeded');

  // 10. Products
  const hoodie = await prisma.product.upsert({
    where: { id: 'seed-product-hoodie' },
    update: {},
    create: { id: 'seed-product-hoodie', name: 'Skyline Hoodie', description: 'Official club hoodie', basePrice: 150000 }
  });
  const sizes = ['S', 'M', 'L', 'XL'];
  for (let i = 0; i < sizes.length; i++) {
    await prisma.productVariant.upsert({
      where: { id: `seed-variant-${sizes[i]}` },
      update: {},
      create: { id: `seed-variant-${sizes[i]}`, productId: hoodie.id, size: sizes[i], stock: i === 1 ? 0 : 10 }
      // Size M has stock 0
    });
  }
  console.log('✅ Products seeded');

  // 11. Fundraiser + Tasks
  const fundraiser = await prisma.fundraiser.upsert({
    where: { id: 'seed-fundraiser-bake' },
    update: {},
    create: { id: 'seed-fundraiser-bake', title: 'Bake Sale', date: new Date(Date.now() + 3 * 86400 * 1000), target: 500000 }
  });
  const taskStatuses = ['TODO', 'IN_PROGRESS', 'DONE'];
  for (let i = 0; i < 3; i++) {
    await prisma.task.create({
      data: {
        title: `Bake Sale Task ${i + 1}`, assigneeId: volunteer.id,
        status: taskStatuses[i], fundraiserId: fundraiser.id,
        dueDate: new Date(Date.now() + 2 * 86400 * 1000)
      }
    });
  }
  console.log('✅ Fundraiser seeded');

  // 12. Sponsor
  const sponsor = await prisma.sponsor.upsert({
    where: { id: 'seed-sponsor-techcorp' },
    update: {},
    create: { id: 'seed-sponsor-techcorp', name: 'TechCorp India', contact: 'sponsor@techcorp.in', stage: 'COMMITTED' }
  });
  const contribution = await prisma.contribution.create({
    data: { sponsorId: sponsor.id, isCash: true, amount: 1000000, description: 'Annual sponsorship' }
  });
  await prisma.ledgerEntry.create({
    data: { type: 'INCOME', category: 'SPONSORSHIP', amount: 1000000, contributionId: contribution.id }
  });
  // 3 deliverables, one overdue
  const deliverableDates = [
    new Date(Date.now() - 5 * 86400 * 1000), // overdue
    new Date(Date.now() + 10 * 86400 * 1000),
    new Date(Date.now() + 20 * 86400 * 1000),
  ];
  for (let i = 0; i < 3; i++) {
    const d = await prisma.deliverable.create({
      data: {
        sponsorId: sponsor.id,
        title: `Deliverable ${i + 1} - ${i === 0 ? 'Logo on Banner (OVERDUE)' : i === 1 ? 'Social Media Shoutout' : 'Booth Space'}`,
        dueDate: deliverableDates[i],
        status: i === 0 ? 'PENDING' : 'PENDING'
      }
    });
    await prisma.task.create({
      data: {
        title: d.title, assigneeId: volunteer.id,
        dueDate: d.dueDate, status: 'TODO',
        deliverableId: d.id
      }
    });
  }
  console.log('✅ Sponsor seeded');

  // 13. Expense Claims
  const pendingClaim = await prisma.expenseClaim.create({
    data: {
      userId: volunteer.id, amount: 25000,
      description: 'Printed banners for gala',
      eventId: upcomingGala.id, status: 'PENDING'
    }
  });
  const paidClaim = await prisma.expenseClaim.create({
    data: {
      userId: volunteer.id, amount: 15000,
      description: 'Venue decorations', status: 'PAID'
    }
  });
  await prisma.ledgerEntry.create({
    data: {
      type: 'EXPENSE', category: 'EXPENSE', amount: 15000,
      description: 'Venue decorations', expenseClaimId: paidClaim.id,
      createdById: treasurer.id
    }
  });
  console.log('✅ Expenses seeded');

  // 14. Announcement
  await prisma.announcement.create({
    data: {
      authorId: president.id,
      title: 'Spring Gala Tickets Now Live!',
      content: 'Get your Spring Gala 2026 tickets before they sell out! Members get a special discount.',
      audience: 'PUBLIC'
    }
  });
  await prisma.announcement.create({
    data: {
      authorId: president.id,
      title: 'Members-Only: Leadership Update',
      content: 'We are excited to announce our new Treasurer. Please welcome them at the next meeting.',
      audience: 'MEMBERS'
    }
  });
  console.log('✅ Announcements seeded');

  console.log('\n🎉 Seeding complete!\n');
  console.log('--- Demo Login Credentials ---');
  console.log('President  : president@skyline.test  / admin123');
  console.log('Treasurer  : treasurer@skyline.test  / treasurer123');
  console.log('Volunteer  : volunteer@skyline.test   / volunteer123');
  console.log('Member     : member1@skyline.test     / member123');
  console.log('Expired    : expired@skyline.test     / expired123');
  console.log('Applicant  : applicant@skyline.test   / applicant123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());