import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import type { Prisma } from '../src/generated/prisma/client';
import {
  banners,
  grades,
  handouts,
  notifications,
  quizzes,
  siteSettings,
  subjects,
  teachers,
  users,
  videos,
} from '../src/lib/data.ts';
import { createPasswordHash } from '../src/lib/password.ts';

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('Set DIRECT_URL or DATABASE_URL before running the seed.');
}

const client = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

function toDate(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

async function main() {
  await client.adminSession.deleteMany();
  await client.notification.deleteMany();
  await client.banner.deleteMany();
  await client.teacher.deleteMany();
  await client.quiz.deleteMany();
  await client.handout.deleteMany();
  await client.video.deleteMany();
  await client.subject.deleteMany();
  await client.grade.deleteMany();
  await client.user.deleteMany();
  await client.siteSetting.deleteMany();

  await client.user.createMany({
    data: users.map((user) => ({
      ...user,
      passwordHash:
        user.username === 'alifakarr' ? createPasswordHash('Aliliwaa00') : null,
      createdAt: toDate(user.createdAt),
    })),
  });

  await client.grade.createMany({ data: grades });
  await client.subject.createMany({ data: subjects });
  await client.video.createMany({
    data: videos.map((video) => ({
      ...video,
      createdAt: toDate(video.createdAt),
    })),
  });
  await client.handout.createMany({
    data: handouts.map((handout) => ({
      ...handout,
      createdAt: toDate(handout.createdAt),
    })),
  });
  await client.quiz.createMany({
    data: quizzes.map((quiz) => ({
      ...quiz,
      createdAt: toDate(quiz.createdAt),
      questions: quiz.questions as unknown as Prisma.InputJsonValue,
    })),
  });
  await client.teacher.createMany({ data: teachers });
  await client.notification.createMany({
    data: notifications.map((notification) => ({
      ...notification,
      createdAt: toDate(notification.createdAt),
    })),
  });
  await client.banner.createMany({
    data: banners.map((banner) => ({
      ...banner,
      createdAt: toDate(banner.createdAt),
    })),
  });
  await client.siteSetting.create({
    data: {
      ...siteSettings,
      updatedAt: toDate(siteSettings.updatedAt),
    },
  });
}

main()
  .then(async () => {
    await client.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await client.$disconnect();
    process.exit(1);
  });
