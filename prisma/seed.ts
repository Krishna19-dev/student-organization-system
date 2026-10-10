import { PrismaClient, MemberRole, MemberTier, MemberStatus, EventStatus, ProductCategory, LedgerType, LedgerCategory } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial ClubManage data...');

  // 1. Seed Members
  const adminPasswordHash = '$2a$10$wK2VvV7vTffx9c9F1iA1zOSL46bV7Wn0Hq76r2eH8P.6aY9v5B9Q6'; // bcrypt hash for 'admin123'
  const defaultMemberPasswordHash = '$2a$10$wK2VvV7vTffx9c9F1iA1zOSL46bV7Wn0Hq76r2eH8P.6aY9v5B9Q6'; // default member pass hash

  const membersData = [
    {
      memberId: 'SKY-001',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@example.edu',
      passwordHash: adminPasswordHash,
      role: MemberRole.ADMIN,
      tier: MemberTier.PREMIUM,
      status: MemberStatus.ACTIVE,
      duePaidRs: 599,
    },
    {
      memberId: 'SKY-ADM-0001',
      name: 'Krishna Choudhary',
      email: 'admin@skyline.edu',
      passwordHash: adminPasswordHash,
      role: MemberRole.ADMIN,
      tier: MemberTier.PREMIUM,
      status: MemberStatus.ACTIVE,
      duePaidRs: 599,
    },
    {
      memberId: 'SKY-002',
      name: 'Priya Patel',
      email: 'priya.patel@example.edu',
      role: MemberRole.TREASURER,
      tier: MemberTier.PREMIUM,
      status: MemberStatus.ACTIVE,
      duePaidRs: 599,
    },
    {
      memberId: 'SKY-003',
      name: 'Rohan Verma',
      email: 'rohan.verma@example.edu',
      role: MemberRole.VOLUNTEER,
      tier: MemberTier.BASIC,
      status: MemberStatus.ACTIVE,
      duePaidRs: 299,
    },
    {
      memberId: 'SKY-004',
      name: 'Ananya Iyer',
      email: 'ananya.iyer@example.edu',
      role: MemberRole.MEMBER,
      tier: MemberTier.BASIC,
      status: MemberStatus.ACTIVE,
      duePaidRs: 299,
    },
    {
      memberId: 'SKY-005',
      name: 'Vikram Malhotra',
      email: 'vikram.m@example.edu',
      role: MemberRole.MEMBER,
      tier: MemberTier.BASIC,
      status: MemberStatus.PENDING,
      duePaidRs: 299,
    },
    {
      memberId: 'SKY-006',
      name: 'Sneha Rao',
      email: 'sneha.rao@example.edu',
      role: MemberRole.VOLUNTEER,
      tier: MemberTier.PREMIUM,
      status: MemberStatus.ACTIVE,
      duePaidRs: 599,
    },
  ];

  for (const m of membersData) {
    await prisma.member.upsert({
      where: { memberId: m.memberId },
      update: m,
      create: m,
    });
  }

  // 2. Seed Events
  const eventsData = [
    {
      eventCode: 'EVT-001',
      title: 'Annual Tech Symposium 2026',
      description: 'Flagship technology conference featuring keynote speakers, hackathons, and project showcases.',
      date: new Date('2026-10-15T09:00:00Z'),
      capacity: 250,
      ticketsSold: 184,
      priceRs: 199,
      status: EventStatus.UPCOMING,
    },
    {
      eventCode: 'EVT-002',
      title: 'Freshers Induction Gala',
      description: 'Welcoming new batch with icebreakers, cultural performances, and club orientation.',
      date: new Date('2026-10-22T17:00:00Z'),
      capacity: 400,
      ticketsSold: 320,
      priceRs: 0,
      status: EventStatus.UPCOMING,
    },
    {
      eventCode: 'EVT-003',
      title: 'Open Source Coding Sprint',
      description: 'Hands-on collaborative coding sprint contributing to community projects.',
      date: new Date('2026-11-05T10:00:00Z'),
      capacity: 80,
      ticketsSold: 65,
      priceRs: 99,
      status: EventStatus.UPCOMING,
    },
    {
      eventCode: 'EVT-004',
      title: 'Cultural Night & Band Showcase',
      description: 'Live musical night featuring student bands, food stalls, and networking.',
      date: new Date('2026-11-18T18:00:00Z'),
      capacity: 500,
      ticketsSold: 0,
      priceRs: 149,
      status: EventStatus.UPCOMING,
    },
  ];

  for (const e of eventsData) {
    await prisma.event.upsert({
      where: { eventCode: e.eventCode },
      update: e,
      create: e,
    });
  }

  // 3. Seed Products & Variants
  const productsData = [
    {
      sku: 'SKY-TEE-01',
      name: 'Skyline Signature Hoodie',
      description: 'Premium heavyweight cotton fleece hoodie with embroidered collegiate Skyline emblem and fleece-lined hood.',
      category: ProductCategory.APPAREL,
      priceRs: 1499,
      memberPriceRs: 1199,
      imagePath: '/images/merch/hoodie.png',
      badge: 'Bestseller',
      status: 'ACTIVE',
      variants: [
        { size: 'S', initialStock: 25, sold: 10, stock: 15 },
        { size: 'M', initialStock: 40, sold: 22, stock: 18 },
        { size: 'L', initialStock: 35, sold: 18, stock: 17 },
        { size: 'XL', initialStock: 20, sold: 12, stock: 8 },
      ]
    },
    {
      sku: 'SKY-TEE-02',
      name: 'Classic Club Oversized Tee',
      description: '240 GSM combed cotton oversized streetwear t-shirt with screen-printed club typography.',
      category: ProductCategory.APPAREL,
      priceRs: 699,
      memberPriceRs: 549,
      imagePath: '/images/merch/tshirt.png',
      badge: 'Popular',
      status: 'ACTIVE',
      variants: [
        { size: 'S', initialStock: 30, sold: 12, stock: 18 },
        { size: 'M', initialStock: 50, sold: 28, stock: 22 },
        { size: 'L', initialStock: 45, sold: 20, stock: 25 },
        { size: 'XL', initialStock: 25, sold: 10, stock: 15 },
      ]
    },
    {
      sku: 'SKY-CAP-01',
      name: 'Structured Vintage Cap',
      description: '6-panel structured cotton twill cap with brass strap buckle and embroidered club crest.',
      category: ProductCategory.HEADWEAR,
      priceRs: 449,
      memberPriceRs: 349,
      imagePath: '/images/merch/cap.png',
      badge: 'Classic',
      status: 'ACTIVE',
      variants: [
        { size: 'Standard (Adjustable)', initialStock: 50, sold: 21, stock: 29 },
      ]
    },
    {
      sku: 'SKY-BOT-01',
      name: 'Matte Thermal Flask (750ml)',
      description: 'Double-walled vacuum insulated stainless steel water bottle. Keeps liquids cold for 24h, hot for 12h.',
      category: ProductCategory.DRINKWARE,
      priceRs: 799,
      memberPriceRs: 649,
      imagePath: '/images/merch/bottle.png',
      badge: 'Eco Pick',
      status: 'ACTIVE',
      variants: [
        { size: '750 ml', initialStock: 40, sold: 16, stock: 24 },
      ]
    },
    {
      sku: 'SKY-TOT-01',
      name: 'Heavy Canvas Tote Bag',
      description: 'Durable 16oz cotton canvas tote bag with reinforced handles and interior zip pouch.',
      category: ProductCategory.GEAR,
      priceRs: 399,
      memberPriceRs: 299,
      imagePath: '/images/merch/totebag.png',
      badge: 'Everyday',
      status: 'ACTIVE',
      variants: [
        { size: 'One Size', initialStock: 60, sold: 25, stock: 35 },
      ]
    },
    {
      sku: 'SKY-NOT-01',
      name: 'Hardbound Executive Journal',
      description: '192-page dot-grid hardbound notebook with ribbon marker, pen loop, and expandable back pocket.',
      category: ProductCategory.STATIONERY,
      priceRs: 349,
      memberPriceRs: 279,
      imagePath: '/images/merch/notebook.png',
      badge: 'Essential',
      status: 'ACTIVE',
      variants: [
        { size: 'A5 (192 Pages)', initialStock: 50, sold: 15, stock: 35 },
      ]
    }
  ];

  for (const p of productsData) {
    const { variants, ...prodFields } = p;
    const prod = await prisma.product.upsert({
      where: { sku: prodFields.sku },
      update: prodFields as any,
      create: prodFields as any,
    });

    for (const v of variants) {
      await prisma.productVariant.upsert({
        where: {
          productId_size: {
            productId: prod.id,
            size: v.size,
          }
        },
        update: {
          initialStock: v.initialStock,
          sold: v.sold,
          stock: v.stock,
        },
        create: {
          productId: prod.id,
          size: v.size,
          initialStock: v.initialStock,
          sold: v.sold,
          stock: v.stock,
        }
      });
    }
  }

  // 4. Seed Ledger Entries (Opening balance + transactions)
  const ledgerData = [
    {
      txnId: 'TXN-9042',
      description: 'Opening Balance (Historical Membership & Sponsorships)',
      type: LedgerType.CREDIT,
      amountRs: 197500,
      category: LedgerCategory.MEMBERSHIP,
      reference: 'BAL-OPENING-2026',
    },
    {
      txnId: 'TXN-9043',
      description: 'Opening Procurement & Operating Expenses',
      type: LedgerType.DEBIT,
      amountRs: 13000,
      category: LedgerCategory.OPERATIONS,
      reference: 'EXP-OPENING-2026',
    },
    {
      txnId: 'TXN-9044',
      description: 'Tech Symposium Early Bird Registrations (Batch 1)',
      type: LedgerType.CREDIT,
      amountRs: 28500,
      category: LedgerCategory.TICKETING,
      reference: 'EVT-001-B1',
    },
    {
      txnId: 'TXN-9045',
      description: 'Merchandise Pre-order Sales (Hoodies & Tees)',
      type: LedgerType.CREDIT,
      amountRs: 16800,
      category: LedgerCategory.MERCHANDISE,
      reference: 'MERCH-PO-01',
    },
    {
      txnId: 'TXN-9046',
      description: 'Campus Auditorium Audio/Visual Booking Advance',
      type: LedgerType.DEBIT,
      amountRs: 8500,
      category: LedgerCategory.OPERATIONS,
      reference: 'INV-AV-8812',
    },
    {
      txnId: 'TXN-9047',
      description: 'Apparel Bulk Manufacturing Deposit (Batch 1)',
      type: LedgerType.DEBIT,
      amountRs: 22000,
      category: LedgerCategory.PROCUREMENT,
      reference: 'INV-MFG-3301',
    },
  ];

  for (const l of ledgerData) {
    await prisma.ledgerEntry.upsert({
      where: { txnId: l.txnId },
      update: l,
      create: l,
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
