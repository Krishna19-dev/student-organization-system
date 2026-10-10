const express = require('express');
const router = express.Router();
const sponsorsController = require('./sponsors.controller');
const { requireAuth } = require('../../middleware/auth');
const { requireRole } = require('../../middleware/roles');
const { uploadProof } = require('../../middleware/upload');

router.use(requireAuth);

// Overdue deliverables (placed before /:id)
router.get(
  '/overdue',
  requireRole('PRESIDENT'),
  sponsorsController.overdue
);

// Deliverables completion
router.patch(
  '/deliverables/:id/complete',
  requireRole('VOLUNTEER', 'PRESIDENT'),
  uploadProof,
  sponsorsController.completeDeliverable
);
router.patch(
  '/:id/complete',
  requireRole('VOLUNTEER', 'PRESIDENT'),
  uploadProof,
  sponsorsController.completeDeliverable
);

// Contribution deliverables creation
router.post(
  '/contributions/:contributionId/deliverables',
  requireRole('PRESIDENT'),
  sponsorsController.addDeliverable
);

// Sponsors CRUD
router.post(
  '/',
  requireRole('PRESIDENT'),
  sponsorsController.createSponsor
);

router.get(
  '/',
  requireRole('PRESIDENT'),
  sponsorsController.listSponsors
);

router.get(
  '/:id',
  requireRole('PRESIDENT'),
  sponsorsController.getSponsor
);

router.patch(
  '/:id/stage',
  requireRole('PRESIDENT'),
  sponsorsController.setStage
);

router.post(
  '/:id/contributions',
  requireRole('PRESIDENT'),
  sponsorsController.addContribution
);

router.get(
  '/:id/receipt',
  requireRole('PRESIDENT'),
  sponsorsController.receipt
);

module.exports = router;