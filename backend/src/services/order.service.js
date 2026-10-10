const defaultPrisma = require('../lib/prisma');
const { badRequest, conflict, notFound } = require('../lib/errors');
const { resolveMerchPricing } = require('./pricing.service');
const ledgerService = require('./ledger.service');

async function checkoutOrder(userId, items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw badRequest('INVALID_ITEMS', 'Order must include at least one item');
  }

  // Soft stock check
  for (const item of items) {
    const variant = await defaultPrisma.productVariant.findUnique({
      where: { id: item.variantId },
      include: { product: true },
    });
    if (!variant) {
      throw notFound('VARIANT_NOT_FOUND', `Product variant ${item.variantId} not found`);
    }
    if (variant.stock < item.quantity) {
      throw conflict(
        'OUT_OF_STOCK',
        `Insufficient stock for ${variant.product.name} (Size: ${variant.size}). Only ${variant.stock} left.`
      );
    }
  }

  const pricing = await resolveMerchPricing(userId, items);

  const order = await defaultPrisma.order.create({
    data: {
      userId,
      status: 'PENDING',
      items: {
        create: items.map((i) => ({
          productVariantId: i.variantId,
          quantity: i.quantity,
        })),
      },
    },
    include: {
      items: {
        include: { productVariant: { include: { product: true } } },
      },
    },
  });

  return {
    order,
    pricing,
  };
}

async function fulfillOrderPayment(tx, orderId, paymentId) {
  const order = await tx.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    throw notFound('ORDER_NOT_FOUND', 'Order not found');
  }

  // Atomic decrement for each item
  for (const item of order.items) {
    const rows = await tx.$executeRaw`
      UPDATE "ProductVariant"
      SET stock = stock - ${item.quantity}
      WHERE id = ${item.productVariantId} AND stock >= ${item.quantity}
    `;
    if (rows === 0) {
      throw conflict('OUT_OF_STOCK', 'Item sold out during payment processing');
    }
  }

  const updatedOrder = await tx.order.update({
    where: { id: orderId },
    data: {
      status: 'PAID',
      paymentId,
    },
  });

  return updatedOrder;
}

async function collectOrder(orderId) {
  const order = await defaultPrisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw notFound('ORDER_NOT_FOUND', 'Order not found');
  if (order.status !== 'PAID') {
    throw badRequest('INVALID_ORDER_STATE', 'Only paid orders can be marked as collected');
  }

  return await defaultPrisma.order.update({
    where: { id: orderId },
    data: { status: 'COLLECTED' },
  });
}

async function getMyOrders(userId) {
  return await defaultPrisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          productVariant: { include: { product: true } },
        },
      },
      payment: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

async function listAdminOrders({ status, page = 1, pageSize = 20 } = {}) {
  const p = Math.max(1, parseInt(page, 10) || 1);
  const ps = Math.max(1, Math.min(100, parseInt(pageSize, 10) || 20));

  const where = {};
  if (status) where.status = status;

  const [orders, total, variantSummary] = await Promise.all([
    defaultPrisma.order.findMany({
      where,
      skip: (p - 1) * ps,
      take: ps,
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: {
          include: { productVariant: { include: { product: true } } },
        },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    defaultPrisma.order.count({ where }),
    defaultPrisma.orderItem.groupBy({
      by: ['productVariantId'],
      _sum: { quantity: true },
      where: status ? { order: { status } } : undefined,
    }),
  ]);

  return { orders, total, page: p, pageSize: ps, variantSummary };
}

module.exports = {
  checkoutOrder,
  fulfillOrderPayment,
  collectOrder,
  getMyOrders,
  listAdminOrders,
};
