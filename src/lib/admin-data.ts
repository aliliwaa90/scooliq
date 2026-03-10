import { unstable_noStore as noStore } from 'next/cache';
import type { CatalogUser } from '@/lib/data';
import { users as fallbackUsers } from '@/lib/data';
import { prisma } from '@/lib/prisma';

function toDateString(value: Date | string) {
  if (typeof value === 'string') {
    return value;
  }

  return value.toISOString().slice(0, 10);
}

export async function getAdminUsers(): Promise<CatalogUser[]> {
  noStore();

  if (!prisma) {
    return fallbackUsers;
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        avatar: true,
        stage: true,
        grade: true,
        province: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return users.map((user) => ({
      ...user,
      role: user.role as CatalogUser['role'],
      createdAt: toDateString(user.createdAt),
    }));
  } catch (error) {
    console.error('Failed to read admin users.', error);
    return fallbackUsers;
  }
}

export async function syncSubjectStats(subjectIds: string | string[]) {
  const db = prisma;

  if (!db) {
    return;
  }

  const uniqueSubjectIds = [...new Set(Array.isArray(subjectIds) ? subjectIds : [subjectIds])].filter(Boolean);

  try {
    await Promise.all(
      uniqueSubjectIds.map(async (subjectId) => {
        const [videoCount, handoutCount, bookCount, quizCount] = await Promise.all([
          db.video.count({
            where: {
              subjectId,
              isActive: true,
            },
          }),
          db.handout.count({
            where: {
              subjectId,
              isActive: true,
              type: {
                not: 'book',
              },
            },
          }),
          db.handout.count({
            where: {
              subjectId,
              isActive: true,
              type: 'book',
            },
          }),
          db.quiz.count({
            where: {
              subjectId,
              isActive: true,
            },
          }),
        ]);

        await db.subject.update({
          where: {
            id: subjectId,
          },
          data: {
            videoCount,
            handoutCount,
            bookCount,
            quizCount,
          },
        });
      }),
    );
  } catch (error) {
    console.error('Failed to sync subject stats.', error);
  }
}
