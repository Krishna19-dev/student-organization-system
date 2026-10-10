const sponsorService = require('../../services/sponsor.service');
const prisma = require('../../lib/prisma');
const { badRequest, notFound } = require('../../lib/errors');
const asyncHandler = require('../../lib/asyncHandler');

exports.createSponsor = asyncHandler(async (req, res) => {
  const sponsor = await sponsorService.createSponsor(req.body);
  res.status(201).json(sponsor);
});

exports.listSponsors = asyncHandler(async (req, res) => {
  const sponsors = await sponsorService.listSponsors();
  res.json(sponsors);
});

exports.getSponsor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const sponsor = await sponsorService.getSponsorById(id);
  res.json(sponsor);
});

exports.setStage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { stage } = req.body;
  if (!stage) throw badRequest('STAGE_REQUIRED', 'Sponsor stage is required');

  const sponsor = await sponsorService.setStage(id, stage);
  res.json(sponsor);
});

exports.addContribution = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const contribution = await sponsorService.addContribution(id, req.body);
  res.status(201).json(contribution);
});

exports.addDeliverable = asyncHandler(async (req, res) => {
  const contributionId = req.params.contributionId || req.body.contributionId;
  const deliverable = await sponsorService.addDeliverable({
    ...req.body,
    contributionId,
  });
  res.status(201).json(deliverable);
});

exports.completeDeliverable = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const proofUrl = req.file ? req.file.filename : req.body.proofUrl;
  const deliverable = await sponsorService.completeDeliverable(id, { proofUrl });
  res.json({ message: 'Deliverable marked as completed', deliverable });
});

exports.overdue = asyncHandler(async (req, res) => {
  const deliverables = await sponsorService.getOverdueDeliverables();
  res.json(deliverables);
});

exports.receipt = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { contributionId } = req.query;

  const sponsor = await sponsorService.getSponsorById(id);
  let contribution = null;

  if (contributionId) {
    contribution = sponsor.contributions.find((c) => c.id === contributionId);
  } else if (sponsor.contributions.length > 0) {
    contribution = sponsor.contributions[0];
  }

  if (!contribution) {
    throw notFound('CONTRIBUTION_NOT_FOUND', 'No matching contribution found for receipt');
  }

  sponsorService.generateReceiptPdf(sponsor, contribution, res);
});
