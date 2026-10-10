const prisma = require('../../lib/prisma');
const { getPrice } = require('../../services/pricing.service');
const { decrementStock } = require('../../services/order.service');

exports.getProducts = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      include: { variants: true }
    });
    res.json(products);
  } catch (error) { next(error); }
};

exports.checkout = async (req, res, next) => {
  try {
    const { variantId, qty } = req.body;
    
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { product: true }
    });
    
    if (!variant || variant.stock < qty) {
      return res.status(409).json({ error: { code: 'OUT_OF_STOCK', message: 'Not enough stock' } });
    }

    // Attempt atomic decrement
    const decremented = await decrementStock(variantId, qty);
    if (!decremented) {
      return res.status(409).json({ error: { code: 'OUT_OF_STOCK', message: 'Not enough stock' } });
    }

    const { isMember, discount } = await getPrice(req.user?.id, null);
    
    let itemPrice = variant.product.basePrice;
    if (isMember && discount) {
      itemPrice = Math.floor(itemPrice * (1 - (discount / 100)));
    }
    const amount = itemPrice * qty;

    const payment = await prisma.payment.create({
      data: {
        userId: req.user.id,
        amount,
        purpose: 'MERCH',
        orderId: 'mock_merch_order_' + Date.now()
      }
    });

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        paymentId: payment.id,
        items: {
          create: [{ productVariantId: variantId, quantity: qty }]
        }
      }
    });

    res.json({ orderId: order.id, paymentId: payment.id, amount, message: 'Stock reserved, verify payment' });
  } catch (error) { next(error); }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const { paymentId, signature } = req.body;
    
    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment || payment.status === 'PAID') return res.json({ message: 'Already paid' });
    
    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: paymentId },
        data: { status: 'PAID', signature }
      });

      const order = await tx.order.findUnique({ where: { paymentId } });
      await tx.order.update({
        where: { id: order.id },
        data: { status: 'PAID' }
      });

      await tx.ledgerEntry.create({
        data: {
          type: 'INCOME',
          category: 'MERCH',
          amount: payment.amount,
          paymentId: payment.id
        }
      });
    });

    res.json({ message: 'Payment verified, order confirmed' });
  } catch (error) { next(error); }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({ where: { userId: req.user.id }, include: { items: true } });
    res.json(orders);
  } catch (error) { next(error); }
};

exports.createProduct = async (req, res, next) => {
  try {
    const product = await prisma.product.create({
      data: req.body
    });
    res.status(201).json(product);
  } catch (error) { next(error); }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(product);
  } catch (error) { next(error); }
};

exports.markCollected = async (req, res, next) => {
  try {
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: 'COLLECTED' }
    });
    res.json(order);
  } catch (error) { next(error); }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({ include: { items: { include: { productVariant: true } }, user: true } });
    res.json(orders);
  } catch (error) { next(error); }
};
