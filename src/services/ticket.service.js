const prisma = require('../lib/prisma');

async function reserveSeats(eventId, qty) {
  try {
    // Atomic update
    const result = await prisma.$executeRaw`
      UPDATE "Event"
      SET "seatsSold" = "seatsSold" + ${qty}
      WHERE id = ${eventId} AND "seatsSold" + ${qty} <= "totalSeats"
    `;
    
    // result is the number of rows updated
    return result > 0;
  } catch (error) {
    console.error("Seat reservation error:", error);
    return false;
  }
}

module.exports = { reserveSeats };
