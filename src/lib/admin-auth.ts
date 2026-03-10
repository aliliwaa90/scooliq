import {
  createHash,
  randomBytes,
} from 'node:crypto';
import { cookies } from 'next/headers';
import { verifyPassword } from '@/lib/password';
import { prisma } from '@/lib/prisma';

const ADMIN_SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

export const ADMIN_SESSION_COOKIE = 'scooliq_admin_session';

type AdminUserRecord = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  avatar: string;
  role: string;
  isActive: boolean;
};

export interface AdminSessionPayload {
  id: string;
  expiresAt: Date;
  user: AdminUserRecord;
}

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

function sanitizeUser(user: AdminUserRecord): AdminUserRecord {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    avatar: user.avatar,
    role: user.role,
    isActive: user.isActive,
  };
}

export function getAdminSessionCookie(token: string, expiresAt: Date) {
  return {
    name: ADMIN_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
  };
}

export function getClearedAdminSessionCookie() {
  return {
    name: ADMIN_SESSION_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  };
}

export async function createAdminSession(userId: string) {
  if (!prisma) {
    throw new Error('Database is not configured.');
  }

  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + ADMIN_SESSION_TTL_MS);

  await prisma.adminSession.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      expiresAt,
    },
  });

  return { token, expiresAt };
}

export async function destroyAdminSession(rawToken: string | null | undefined) {
  if (!prisma || !rawToken) {
    return;
  }

  try {
    await prisma.adminSession.deleteMany({
      where: {
        tokenHash: hashToken(rawToken),
      },
    });
  } catch (error) {
    console.error('Failed to destroy admin session.', error);
  }
}

export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  if (!prisma) {
    return null;
  }

  const cookieStore = await cookies();
  const rawToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!rawToken) {
    return null;
  }

  try {
    const session = await prisma.adminSession.findUnique({
      where: {
        tokenHash: hashToken(rawToken),
      },
      include: {
        user: true,
      },
    });

    if (!session) {
      return null;
    }

    if (session.expiresAt <= new Date() || !session.user.isActive || session.user.role !== 'admin') {
      await prisma.adminSession.deleteMany({
        where: {
          id: session.id,
        },
      });
      return null;
    }

    return {
      id: session.id,
      expiresAt: session.expiresAt,
      user: sanitizeUser(session.user),
    };
  } catch (error) {
    console.error('Failed to read admin session.', error);
    return null;
  }
}

export async function authenticateAdmin(username: string, password: string) {
  if (!prisma) {
    return null;
  }

  try {
    const admin = await prisma.user.findUnique({
      where: {
        username: username.trim(),
      },
    });

    if (!admin || admin.role !== 'admin' || !admin.isActive) {
      return null;
    }

    if (!verifyPassword(password, admin.passwordHash)) {
      return null;
    }

    const session = await createAdminSession(admin.id);

    return {
      ...session,
      user: sanitizeUser(admin),
    };
  } catch (error) {
    console.error('Failed to authenticate admin.', error);
    return null;
  }
}
