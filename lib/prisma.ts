import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"

// DATABASE_URL = Transaction pooler (port 6543) — for runtime (Next.js app)
// DIRECT_URL   = Direct connection (port 5432) — for Prisma Migrate only (not used here)
const connectionString = process.env.DATABASE_URL!

// Create a PostgreSQL connection pool using the pooler URL
const pool = new pg.Pool({ connectionString })

// Prisma 7 requires a driver adapter instead of reading the URL from schema.prisma
const adapter = new PrismaPg(pool)

// Prevent multiple PrismaClient instances during Next.js hot reloads in dev
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
