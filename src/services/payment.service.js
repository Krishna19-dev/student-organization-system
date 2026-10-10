const prisma = require('../lib/prisma');

async function createPaymentOrder(userId, amount, purpose) {
  // In a real app, integrate Razorpay instance here
  const orderId = `order_${crypto.randomBytes(8).toString('hex')}`;
  
  return await prisma.payment.create({
    data: {
      userId,
      amount,
      purpose,
      orderId,
      status: 'CREATED'
    }
  });
}

async function isPaymentVerified(paymentId) {
  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
  return payment && payment.status === 'PAID';
}

module.exports = { createPaymentOrder, isPaymentVerified };
