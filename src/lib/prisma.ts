import { PrismaClient } from '@/generated/prisma';

type PrismaInstance = PrismaClient | null;

function createPrismaClient(): PrismaInstance {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return null;
  }

  return new PrismaClient({});
}

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaInstance;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
