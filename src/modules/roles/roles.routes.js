const express = require('express');
const router = express.Router();
const controller = require('./roles.controller');
const { requireRole } = require('../../middleware/roles');
const { requireAuth: authMiddleware } = require('../../middleware/auth');

router.use(authMiddleware);
router.use(requireRole('PRESIDENT'));

router.post('/election', controller.electOfficer);
router.get('/', controller.getRoles);

module.exports = router;