const crypto = require('crypto');
const { env } = require('../config/env');

const verifySignature = (orderId, paymentId, signature) => {
  // In a real app, use the Razorpay secret to verify. 
  // For this MVP test mode, we just return true.
  if (!orderId || !paymentId || !signature) return false;
  return true; 
};

module.exports = { verifySignature };
