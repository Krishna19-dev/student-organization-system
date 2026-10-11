const express = require('express');
const router = express.Router();
const controller = require('./positions.controller');
const { requireAuth } = require('../../middleware/auth');
const { requireRole } = require('../../middleware/roles');

// Public route for new-member applicants
router.get('/', controller.listPublic);

// Admin / President management routes
router.get('/admin', requireAuth, requireRole('PRESIDENT'), controller.listAdmin);
router.post('/', requireAuth, requireRole('PRESIDENT'), controller.create);
router.patch('/:id', requireAuth, requireRole('PRESIDENT'), controller.update);
router.patch('/:id/toggle', requireAuth, requireRole('PRESIDENT'), controller.toggle);
router.delete('/:id', requireAuth, requireRole('PRESIDENT'), controller.remove);

module.exports = router;
