const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // TODO: Add seed logic
}

main().catch(console.error).finally(() => prisma.$disconnect());