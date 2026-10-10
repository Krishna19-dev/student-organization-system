const prisma = require('../lib/prisma');
const { isActiveMember } = require('./role.service');

async function resolveTicketPrice(userId, event) {
  const isMember = await isActiveMember(userId);
  if (isMember) {
    return {
      unitPrice: event.memberPrice,
      isMemberPrice: true,
    };
  }

  return {
    unitPrice: event.guestPrice,
    isMemberPrice: false,
  };
}

async function resolveMerchPricing(userId, items) {
  // items: [{ variantId, quantity }]
  let percent = 0;
  if (userId) {
    const isMember = await isActiveMember(userId);
    if (isMember) {
      const membership = await prisma.membership.findFirst({
        where: {
          userId,
          status: 'ACTIVE',
          expiryDate: { gt: new Date() },
        },
        include: { membershipPlan: true },
      });
      if (membership?.membershipPlan?.merchDiscount) {
        percent = membership.membershipPlan.merchDiscount;
      }
    }
  }

  let subtotal = 0;
  const lines = [];

  for (const item of items) {
    const variant = await prisma.productVariant.findUnique({
      where: { id: item.variantId },
      include: { product: true },
    });

    if (!variant) {
      throw new Error(`Variant not found: ${item.variantId}`);
    }

    const unitPrice = variant.product.basePrice;
    const lineTotal = unitPrice * item.quantity;
    subtotal += lineTotal;

    lines.push({
      variantId: variant.id,
      productName: variant.product.name,
      size: variant.size,
      unitPrice,
      quantity: item.quantity,
      lineTotal,
    });
  }

  const discount = Math.floor((subtotal * percent) / 100);
  const total = Math.max(0, subtotal - discount);

  return {
    subtotal,
    discount,
    total,
    discountPercent: percent,
    lines,
  };
}

module.exports = {
  resolveTicketPrice,
  resolveMerchPricing,
};
