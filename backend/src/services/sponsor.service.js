const defaultPrisma = require('../lib/prisma');
const { notFound, badRequest } = require('../lib/errors');
const ledgerService = require('./ledger.service');
const PDFDocument = require('pdfkit');

async function createSponsor({ name, organization, contact, contactName, contactEmail, contactPhone, stage = 'LEAD' }) {
  const sponsorName = name || organization;
  if (!sponsorName) throw badRequest('NAME_REQUIRED', 'Sponsor name or organization is required');

  const contactStr = contact || [contactName, contactEmail, contactPhone].filter(Boolean).join(' | ');

  return await defaultPrisma.sponsor.create({
    data: {
      name: sponsorName,
      contact: contactStr || null,
      stage: stage || 'LEAD',
    },
  });
}

async function listSponsors() {
  const sponsors = await defaultPrisma.sponsor.findMany({
    include: {
      contributions: true,
      deliverables: true,
    },
    orderBy: { name: 'asc' },
  });

  return sponsors.map((s) => {
    const totalCash = s.contributions
      .filter((c) => c.isCash)
      .reduce((acc, c) => acc + (c.amount || 0), 0);
    const totalInKind = s.contributions
      .filter((c) => !c.isCash)
      .reduce((acc, c) => acc + (c.amount || 0), 0);
    return {
      ...s,
      totalCash,
      totalInKind,
    };
  });
}

async function getSponsorById(id) {
  const sponsor = await defaultPrisma.sponsor.findUnique({
    where: { id },
    include: {
      contributions: { include: { event: true } },
      deliverables: { include: { task: true } },
    },
  });
  if (!sponsor) throw notFound('SPONSOR_NOT_FOUND', 'Sponsor not found');
  return sponsor;
}

async function setStage(id, stage) {
  const sponsor = await defaultPrisma.sponsor.findUnique({ where: { id } });
  if (!sponsor) throw notFound('SPONSOR_NOT_FOUND', 'Sponsor not found');

  return await defaultPrisma.sponsor.update({
    where: { id },
    data: { stage },
  });
}

async function addContribution(sponsorId, { isCash, type, amount, estimatedValue, description, eventId }) {
  const sponsor = await defaultPrisma.sponsor.findUnique({ where: { id: sponsorId } });
  if (!sponsor) throw notFound('SPONSOR_NOT_FOUND', 'Sponsor not found');

  const cash = isCash !== undefined ? Boolean(isCash) : (type || '').toUpperCase() === 'CASH';
  const val = cash ? parseInt(amount, 10) : parseInt(estimatedValue || amount, 10) || 0;

  if (cash && (!val || val <= 0)) {
    throw badRequest('INVALID_AMOUNT', 'Cash contribution must have a positive amount in paise');
  }

  return await defaultPrisma.$transaction(async (tx) => {
    const contrib = await tx.contribution.create({
      data: {
        sponsorId,
        isCash: cash,
        amount: val,
        description: description || null,
        eventId: eventId || null,
      },
      include: { sponsor: true, event: true },
    });

    if (cash) {
      await ledgerService.post(tx, {
        type: 'INCOME',
        category: 'SPONSORSHIP',
        amount: val,
        contributionId: contrib.id,
        eventId: eventId || null,
        description: `Sponsorship contribution from ${sponsor.name}: ${description || ''}`,
      });
    }

    return contrib;
  });
}

async function addDeliverable({ sponsorId, contributionId, title, ownerId, dueDate }) {
  let targetSponsorId = sponsorId;
  let eventId = null;

  if (contributionId) {
    const contrib = await defaultPrisma.contribution.findUnique({ where: { id: contributionId } });
    if (!contrib) throw notFound('CONTRIBUTION_NOT_FOUND', 'Contribution not found');
    targetSponsorId = contrib.sponsorId;
    eventId = contrib.eventId;
  }

  if (!targetSponsorId) throw badRequest('SPONSOR_ID_REQUIRED', 'Sponsor ID is required');
  if (!title) throw badRequest('TITLE_REQUIRED', 'Title is required');

  return await defaultPrisma.$transaction(async (tx) => {
    const deliverable = await tx.deliverable.create({
      data: {
        sponsorId: targetSponsorId,
        title,
        ownerId: ownerId || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: 'PENDING',
      },
    });

    if (ownerId) {
      await tx.task.create({
        data: {
          title: `Deliverable: ${title}`,
          assigneeId: ownerId,
          dueDate: dueDate ? new Date(dueDate) : null,
          eventId: eventId || null,
          deliverableId: deliverable.id,
          status: 'TODO',
        },
      });
    }

    return deliverable;
  });
}

async function completeDeliverable(id, { proofUrl }) {
  const deliverable = await defaultPrisma.deliverable.findUnique({
    where: { id },
    include: { task: true },
  });

  if (!deliverable) throw notFound('DELIVERABLE_NOT_FOUND', 'Deliverable not found');

  return await defaultPrisma.$transaction(async (tx) => {
    const updated = await tx.deliverable.update({
      where: { id },
      data: {
        status: 'DONE',
        proofUrl: proofUrl || deliverable.proofUrl,
      },
    });

    if (deliverable.task) {
      await tx.task.update({
        where: { id: deliverable.task.id },
        data: { status: 'DONE' },
      });
    }

    return updated;
  });
}

async function getOverdueDeliverables() {
  const now = new Date();
  return await defaultPrisma.deliverable.findMany({
    where: {
      status: 'PENDING',
      dueDate: { lt: now },
    },
    include: {
      sponsor: true,
      task: { include: { assignee: { select: { id: true, name: true, email: true } } } },
    },
    orderBy: { dueDate: 'asc' },
  });
}

function generateReceiptPdf(sponsor, contribution, res) {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `inline; filename="receipt-${sponsor.name.toLowerCase().replace(/\s+/g, '-')}.pdf"`
  );

  doc.pipe(res);

  doc.fontSize(22).text('Skyline Student Association', { align: 'center' });
  doc.fontSize(14).text('Official Sponsorship Receipt', { align: 'center' });
  doc.moveDown();

  const receiptNum = `SKY-SP-${Math.floor(100000 + Math.random() * 900000)}`;
  doc.fontSize(10).text(`Receipt No: ${receiptNum}`);
  doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`);
  doc.moveDown();

  doc.fontSize(12).text(`Received with thanks from: ${sponsor.name}`);
  if (sponsor.contact) doc.text(`Contact: ${sponsor.contact}`);
  doc.moveDown();

  doc.text(`Contribution Type: ${contribution.isCash ? 'CASH' : 'IN-KIND'}`);
  const amtFormatted = ((contribution.amount || 0) / 100).toFixed(2);
  doc.text(`Value: ₹${amtFormatted}`);
  if (contribution.description) doc.text(`Details: ${contribution.description}`);
  if (contribution.event) doc.text(`Designated Event: ${contribution.event.title}`);

  doc.moveDown(2);
  doc.text('Thank you for partnering with Skyline Student Association!', { align: 'center' });
  doc.text('Authorized Signatory: _________________________', { align: 'right' });

  doc.end();
}

module.exports = {
  createSponsor,
  listSponsors,
  getSponsorById,
  setStage,
  addContribution,
  addDeliverable,
  completeDeliverable,
  getOverdueDeliverables,
  generateReceiptPdf,
};
