const defaultPrisma = require('../lib/prisma');
const { createGatewayOrder, verifySignature } = require('../lib/razorpay');
const { notFound, badRequest, conflict } = require('../lib/errors');
const ledgerService = require('./ledger.service');
const auditService = require('./audit.service');
const { generateUniqueMemberCode } = require('./membership.service');
const { generateToken } = require('../lib/qr');

const handlers = {
  DUES: async (tx, payment) => {
    let applicationId = payment.meta?.applicationId;
    if (!applicationId) {
      const app = await tx.application.findFirst({
        where: { userId: payment.userId, status: 'PAYMENT_PENDING' },
      });
      applicationId = app?.id;
    }

    if (!applicationId) {
      throw notFound('APPLICATION_NOT_FOUND', 'Pending application not found for payment');
    }

    const application = await tx.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      throw notFound('APPLICATION_NOT_FOUND', 'Application record missing');
    }

    const plan = await tx.membershipPlan.findUnique({
      where: { tier: application.tier },
    });

    if (!plan) {
      throw notFound('PLAN_NOT_FOUND', `Membership plan for tier ${application.tier} not found`);
    }

    // 1. Update application to UNDER_REVIEW
    await tx.application.update({
      where: { id: applicationId },
      data: {
        status: 'UNDER_REVIEW',
        submittedAt: new Date(),
        paymentId: payment.id,
      },
    });

    // 2. Create PENDING Membership placeholder
    const memberCode = await generateUniqueMemberCode(tx);
    const qrToken = generateToken();
    const now = new Date();
    const oneYearLater = new Date();
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

    const membership = await tx.membership.create({
      data: {
        userId: payment.userId,
        membershipPlanId: plan.id,
        status: 'PENDING',
        startDate: now,
        expiryDate: oneYearLater,
        memberCode,
        qrToken,
      },
    });

    // 3. Post to ledger
    await ledgerService.post(tx, {
      type: 'INCOME',
      category: 'DUES',
      amount: payment.amount,
      paymentId: payment.id,
      description: `Membership dues: ${application.tier}`,
    });

    return { applicationStatus: 'UNDER_REVIEW', membershipId: membership.id };
  },

  TICKETS: async (tx, payment) => {
    const meta = payment.meta || {};
    const eventId = meta.eventId;
    const quantity = parseInt(meta.quantity, 10) || 1;

    if (!eventId) {
      throw badRequest('INVALID_PAYMENT_META', 'Missing eventId in payment metadata');
    }

    // Atomic seat capacity check and update
    const rows = await tx.$executeRaw`
      UPDATE "Event"
      SET "seatsSold" = "seatsSold" + ${quantity}
      WHERE id = ${eventId} AND "seatsSold" + ${quantity} <= "totalSeats"
    `;

    if (rows === 0) {
      throw conflict('SOLD_OUT', 'Seats sold out during checkout. Refund required.');
    }

    // Issue tickets
    const tickets = [];
    for (let i = 0; i < quantity; i++) {
      const qrToken = generateToken();
      const ticket = await tx.ticket.create({
        data: {
          eventId,
          userId: payment.userId,
          paymentId: payment.id,
          qrToken,
          status: 'VALID',
        },
      });
      tickets.push(ticket);
    }

    // Post to ledger
    await ledgerService.post(tx, {
      type: 'INCOME',
      category: 'TICKETS',
      amount: payment.amount,
      paymentId: payment.id,
      eventId,
      description: `Event ticket purchase (${quantity} seats)`,
    });

    return { ticketsCount: tickets.length, tickets };
  },

  MERCH: async (tx, payment) => {
    const orderId = payment.meta?.orderId;
    if (!orderId) {
      throw badRequest('INVALID_PAYMENT_META', 'Missing orderId in payment metadata');
    }

    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw notFound('ORDER_NOT_FOUND', 'Order not found');
    }

    // Decrement stock for each item atomically
    for (const item of order.items) {
      const updated = await tx.$executeRaw`
        UPDATE "ProductVariant"
        SET stock = stock - ${item.quantity}
        WHERE id = ${item.productVariantId} AND stock >= ${item.quantity}
      `;
      if (updated === 0) {
        throw conflict('OUT_OF_STOCK', 'Item sold out during payment processing');
      }
    }

    // Mark order PAID
    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: {
        status: 'PAID',
        paymentId: payment.id,
      },
    });

    // Post to ledger
    await ledgerService.post(tx, {
      type: 'INCOME',
      category: 'MERCH',
      amount: payment.amount,
      paymentId: payment.id,
      description: `Merchandise order ${orderId}`,
    });

    return { order: updatedOrder };
  },
};

// Aliases
handlers.TICKET = handlers.TICKETS;

async function createOrder({ purpose, amount, userId, meta }) {
  if (!amount || amount <= 0) {
    throw badRequest('INVALID_AMOUNT', 'Amount must be greater than zero');
  }

  const gateway = createGatewayOrder(amount);

  const payment = await defaultPrisma.payment.create({
    data: {
      userId,
      amount,
      purpose,
      orderId: gateway.id,
      status: 'CREATED',
      meta: meta || {},
    },
  });

  return {
    paymentId: payment.id,
    gatewayOrderId: gateway.id,
    amount,
    currency: 'INR',
    keyId: gateway.keyId,
  };
}

async function confirmPayment({ gatewayOrderId, gatewayPaymentId, signature, actorId }) {
  const payment = await defaultPrisma.payment.findFirst({
    where: { orderId: gatewayOrderId },
  });

  if (!payment) {
    throw notFound('PAYMENT_NOT_FOUND', 'No payment matching the gateway order ID');
  }

  // Idempotency: if already paid, return success
  if (payment.status === 'PAID') {
    return { status: 'PAID', idempotent: true, paymentId: payment.id };
  }

  // Verify signature
  const isValid = verifySignature(gatewayOrderId, gatewayPaymentId, signature);
  if (!isValid) {
    throw badRequest('INVALID_SIGNATURE', 'Payment signature verification failed');
  }

  const handler = handlers[payment.purpose];
  if (!handler) {
    throw badRequest('UNKNOWN_PURPOSE', `No payment handler for purpose: ${payment.purpose}`);
  }

  try {
    const result = await defaultPrisma.$transaction(async (tx) => {
      const updatedPayment = await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: 'PAID',
          paymentId: gatewayPaymentId,
          signature: signature || null,
        },
      });

      const handlerResult = await handler(tx, { ...payment, id: updatedPayment.id });
      return { payment: updatedPayment, handlerResult };
    });

    return {
      status: 'PAID',
      paymentId: payment.id,
      ...result.handlerResult,
    };
  } catch (err) {
    // If capacity or stock failed, mark payment FAILED in a separate write
    if (err.code === 'SOLD_OUT' || err.code === 'OUT_OF_STOCK') {
      await defaultPrisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED' },
      });
      if (actorId) {
        await auditService.logAudit(actorId, 'PAYMENT_CAPACITY_FAILED', payment.id, 'Payment');
      }
    }
    throw err;
  }
}

async function markPaidManually({ paymentId, adminId }) {
  const payment = await defaultPrisma.payment.findUnique({
    where: { id: paymentId },
  });

  if (!payment) {
    throw notFound('PAYMENT_NOT_FOUND', 'Payment not found');
  }

  if (payment.status === 'PAID') {
    return { status: 'PAID', idempotent: true };
  }

  const handler = handlers[payment.purpose];
  if (!handler) {
    throw badRequest('UNKNOWN_PURPOSE', `No payment handler for purpose: ${payment.purpose}`);
  }

  const result = await defaultPrisma.$transaction(async (tx) => {
    const updatedPayment = await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: 'PAID',
        paymentId: `manual_${Date.now()}`,
      },
    });

    await auditService.log(tx, {
      actorId: adminId,
      action: 'PAYMENT_MARKED_PAID',
      targetType: 'Payment',
      targetId: payment.id,
    });

    const handlerResult = await handler(tx, { ...payment, id: updatedPayment.id });
    return { payment: updatedPayment, handlerResult };
  });

  return {
    status: 'PAID',
    manual: true,
    ...result.handlerResult,
  };
}

module.exports = {
  createOrder,
  confirmPayment,
  markPaidManually,
};
