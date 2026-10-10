const prisma = require('../lib/prisma');

async function decrementStock(variantId, qty) {
  try {
    const result = await prisma.$executeRaw`
      UPDATE "ProductVariant"
      SET stock = stock - ${qty}
      WHERE id = ${variantId} AND stock >= ${qty}
    `;
    return result > 0;
  } catch (error) {
    console.error("Stock decrement error:", error);
    return false;
  }
}

module.exports = { decrementStock };
