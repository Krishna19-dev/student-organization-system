const crypto = require('crypto');
const { env } = require('../config/env');

function isMockMode() {
  return (env.PAYMENT_MODE || 'mock').toLowerCase() === 'mock';
}

function createGatewayOrder(amountInPaise, receipt) {
  if (isMockMode()) {
    const randomSuffix = crypto.randomBytes(8).toString('hex');
    return {
      id: `order_mock_${randomSuffix}`,
      amount: amountInPaise,
      currency: 'INR',
      receipt: receipt || `rcpt_${randomSuffix}`,
      keyId: 'rzp_mock_key',
    };
  }

  // If Razorpay SDK is configured
  return {
    id: `order_${crypto.randomBytes(8).toString('hex')}`,
    amount: amountInPaise,
    currency: 'INR',
    receipt: receipt || undefined,
    keyId: env.RAZORPAY_KEY_ID || 'rzp_test_key',
  };
}

function verifySignature(orderId, paymentId, signature) {
  if (!orderId || !paymentId || !signature) return false;

  if (isMockMode()) {
    return signature === 'mock_signature' || signature.startsWith('mock_');
  }

  const secret = env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    return false;
  }

  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  const expectedBuffer = Buffer.from(expectedSignature, 'utf-8');
  const signatureBuffer = Buffer.from(signature, 'utf-8');

  if (expectedBuffer.length !== signatureBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
}

module.exports = {
  isMockMode,
  createGatewayOrder,
  verifySignature,
};
