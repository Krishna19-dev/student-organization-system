const express = require('express');
const router = express.Router();
const rolesController = require('./roles.controller');
const { requireAuth } = require('../../middleware/auth');
const { requireRole } = require('../../middleware/roles');

router.use(requireAuth);

router.post('/election', requireRole('PRESIDENT'), rolesController.electOfficer);
router.get('/', requireRole('PRESIDENT'), rolesController.getRoles);

module.exports = router;