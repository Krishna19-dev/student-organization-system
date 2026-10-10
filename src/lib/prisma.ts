// ─────────────────────────────────────────────────────────────────────────────
//  Singleton Prisma Client
//  Safe for Next.js 15 development with hot-reload (Turbopack).
//  In production, a single PrismaClient instance is created.
//  In development, the instance is cached on globalThis to prevent
//  exhausting database connections during hot module reloads.
// ─────────────────────────────────────────────────────────────────────────────

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
