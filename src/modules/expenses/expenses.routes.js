const express = require('express');
const router = express.Router();
const controller = require('./expenses.controller');
const { requireRole } = require('../../middleware/roles');
const { requireAuth: authMiddleware } = require('../../middleware/auth');
const upload = require('../../middleware/upload');

router.use(authMiddleware);

router.post('/', upload.single('receipt'), controller.submitExpense);
router.get('/mine', controller.getMyExpenses);

router.use(requireRole('TREASURER', 'PRESIDENT'));
router.get('/', controller.getQueue);
router.post('/:id/approve', controller.approveExpense);
router.post('/:id/reject', controller.rejectExpense);
router.post('/:id/pay', controller.payExpense);

module.exports = router;