const express = require('express');
const router = express.Router();
const shopController = require('./shop.controller');
const { requireRole, requireActiveMember } = require('../../middleware/roles');
const { requireAuth: authMiddleware } = require('../../middleware/auth');

router.get('/products', shopController.getProducts);

// Order creation allows Guests and Members
router.post('/orders/checkout', authMiddleware, shopController.checkout);
router.post('/orders/verify-payment', authMiddleware, shopController.verifyPayment);
router.get('/orders/mine', authMiddleware, shopController.getMyOrders);

// Admin routes
router.use(authMiddleware);
router.post('/products', requireRole('PRESIDENT'), shopController.createProduct);
router.patch('/products/:id', requireRole('PRESIDENT'), shopController.updateProduct);
router.patch('/orders/:id/collect', requireRole('VP_EVENTS', 'PRESIDENT'), shopController.markCollected);
router.get('/admin/orders', requireRole('PRESIDENT'), shopController.getAllOrders);

module.exports = router;