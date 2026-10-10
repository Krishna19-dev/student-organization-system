const express = require('express');
const router = express.Router();
const shopController = require('./shop.controller');
const { requireRole } = require('../../middleware/roles');
const { requireAuth } = require('../../middleware/auth');

// Products
router.get('/products', shopController.listProducts);
router.get('/', shopController.listProducts);
router.post('/products', requireAuth, requireRole('PRESIDENT'), shopController.createProduct);
router.post('/', requireAuth, requireRole('PRESIDENT'), shopController.createProduct);
router.patch('/products/:id', requireAuth, requireRole('PRESIDENT'), shopController.updateProduct);
router.patch('/:id', requireAuth, requireRole('PRESIDENT'), shopController.updateProduct);

// Orders
router.post('/orders/checkout', requireAuth, shopController.checkoutOrder);
router.post('/checkout', requireAuth, shopController.checkoutOrder);

router.post('/orders/verify-payment', requireAuth, shopController.verifyOrderPayment);
router.post('/verify-payment', requireAuth, shopController.verifyOrderPayment);

router.get('/orders/mine', requireAuth, shopController.myOrders);
router.get('/mine', requireAuth, shopController.myOrders);

router.patch('/orders/:id/collect', requireAuth, requireRole('VP_EVENTS', 'PRESIDENT'), shopController.collectOrder);
router.patch('/:id/collect', requireAuth, requireRole('VP_EVENTS', 'PRESIDENT'), shopController.collectOrder);

// Admin order list
router.get('/admin/orders', requireAuth, requireRole('PRESIDENT'), shopController.adminOrders);

module.exports = router;