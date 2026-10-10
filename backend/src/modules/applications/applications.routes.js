const express = require('express');
const router = express.Router();
const appController = require('./applications.controller');
const { requireAuth } = require('../../middleware/auth');

router.use(requireAuth);

router.post('/', appController.applyLater);
router.get('/mine', appController.myApplication);
router.post('/pay', appController.createDuesOrder);
router.post('/verify', appController.verifyDues);

module.exports = router;