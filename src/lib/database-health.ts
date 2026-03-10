import { prisma } from '@/lib/prisma';

export async function isDatabaseReachable() {
  if (!prisma) {
    return false;
  }

  try {
    await prisma.user.count();
    return true;
  } catch (error) {
    console.error('Database connectivity check failed.', error);
    return false;
  }
}
