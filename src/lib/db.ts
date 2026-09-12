import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma 7 requires a driver adapter for the client at runtime (the
// datasource block in schema.prisma no longer carries a connection URL —
// see prisma.config.ts, which is used by the CLI for migrate/studio only).
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

// Standard Next.js dev-mode singleton pattern: avoids exhausting database
// connections from hot-reload creating a new PrismaClient on every reload.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
