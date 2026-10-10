const express = require('express');
const router = express.Router();
const handoverController = require('./handover.controller');
const { requireAuth } = require('../../middleware/auth');
const { requireRole } = require('../../middleware/roles');

router.use(requireAuth);

router.post(
  '/',
  requireRole('TREASURER', 'PRESIDENT'),
  handoverController.writeNote
);

router.get(
  '/',
  requireRole('TREASURER', 'PRESIDENT'),
  handoverController.readNotes
);

module.exports = router;