const prisma = require('../../lib/prisma');
const orderService = require('../../services/order.service');
const paymentService = require('../../services/payment.service');
const { badRequest, notFound } = require('../../lib/errors');
const asyncHandler = require('../../lib/asyncHandler');

// Product Controllers
exports.listProducts = asyncHandler(async (req, res) => {
  const products = await prisma.product.findMany({
    include: {
      variants: {
        orderBy: { size: 'asc' },
      },
    },
    orderBy: { name: 'asc' },
  });

  const formatted = products.map((p) => ({
    ...p,
    variants: p.variants.map((v) => ({
      ...v,
      soldOut: v.stock <= 0,
    })),
  }));

  res.json(formatted);
});

exports.createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, basePrice, variants } = req.body;
  const cost = parseInt(basePrice || price, 10);

  if (!name || isNaN(cost) || cost < 0) {
    throw badRequest('VALIDATION_ERROR', 'Product name and valid base price in paise are required');
  }

  if (!Array.isArray(variants) || variants.length === 0) {
    throw badRequest('VARIANTS_REQUIRED', 'At least one variant (size & stock) is required');
  }

  // Check unique sizes
  const sizes = variants.map((v) => (v.size || '').trim());
  if (new Set(sizes).size !== sizes.length) {
    throw badRequest('DUPLICATE_SIZES', 'Sizes must be unique within a product');
  }

  const product = await prisma.product.create({
    data: {
      name,
      description: description || null,
      basePrice: cost,
      variants: {
        create: variants.map((v) => ({
          size: v.size,
          stock: Math.max(0, parseInt(v.stock, 10) || 0),
        })),
      },
    },
    include: { variants: true },
  });

  res.status(201).json(product);
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, price, basePrice, variants } = req.body;

  const existing = await prisma.product.findUnique({
    where: { id },
    include: { variants: true },
  });

  if (!existing) throw notFound('PRODUCT_NOT_FOUND', 'Product not found');

  const updateData = {};
  if (name) updateData.name = name;
  if (description !== undefined) updateData.description = description;
  if (price !== undefined || basePrice !== undefined) {
    updateData.basePrice = parseInt(basePrice || price, 10);
  }

  const updated = await prisma.$transaction(async (tx) => {
    if (Object.keys(updateData).length > 0) {
      await tx.product.update({
        where: { id },
        data: updateData,
      });
    }

    if (Array.isArray(variants)) {
      for (const v of variants) {
        if (v.id) {
          await tx.productVariant.update({
            where: { id: v.id },
            data: {
              size: v.size !== undefined ? v.size : undefined,
              stock: v.stock !== undefined ? Math.max(0, parseInt(v.stock, 10)) : undefined,
            },
          });
        } else if (v.size) {
          await tx.productVariant.create({
            data: {
              productId: id,
              size: v.size,
              stock: Math.max(0, parseInt(v.stock, 10) || 0),
            },
          });
        }
      }
    }

    return await tx.product.findUnique({
      where: { id },
      include: { variants: true },
    });
  });

  res.json(updated);
});

// Order Controllers
exports.checkoutOrder = asyncHandler(async (req, res) => {
  const { items } = req.body;
  if (!items || !Array.isArray(items)) {
    throw badRequest('ITEMS_REQUIRED', 'An items array is required for checkout');
  }

  const { order, pricing } = await orderService.checkoutOrder(req.user.id, items);

  const paymentOrder = await paymentService.createOrder({
    purpose: 'MERCH',
    amount: pricing.total,
    userId: req.user.id,
    meta: { orderId: order.id },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { paymentId: paymentOrder.paymentId },
  });

  res.json({
    order,
    pricing,
    payment: paymentOrder,
  });
});

exports.verifyOrderPayment = asyncHandler(async (req, res) => {
  const { gatewayOrderId, gatewayPaymentId, signature } = req.body;
  if (!gatewayOrderId) {
    throw badRequest('ORDER_ID_REQUIRED', 'Gateway order ID is required');
  }

  const result = await paymentService.confirmPayment({
    gatewayOrderId,
    gatewayPaymentId: gatewayPaymentId || `pay_${Date.now()}`,
    signature: signature || 'mock_signature',
    actorId: req.user.id,
  });

  res.json({
    message: 'Merchandise payment verified successfully',
    ...result,
  });
});

exports.myOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getMyOrders(req.user.id);
  res.json(orders);
});

exports.collectOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await orderService.collectOrder(id);
  res.json({ message: 'Order marked as collected', order });
});

exports.adminOrders = asyncHandler(async (req, res) => {
  const { status, page, pageSize } = req.query;
  const result = await orderService.listAdminOrders({ status, page, pageSize });
  res.json(result);
});
