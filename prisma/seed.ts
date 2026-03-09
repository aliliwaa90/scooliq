import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import type { Prisma } from '../src/generated/prisma/client';
import {
  grades,
  subjects,
  videos,
  handouts,
  quizzes,
  teachers,
  notifications,
} from '../src/lib/data.ts';

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('Set DIRECT_URL or DATABASE_URL before running the seed.');
}

const client = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const users = [
  {
    id: 'u1',
    firstName: 'أحمد',
    lastName: 'العراقي',
    username: 'ahmed_iq',
    avatar: '',
    stage: 'متوسط',
    grade: 'g9',
    province: 'بغداد',
    role: 'student',
    isActive: true,
  },
  {
    id: 'u2',
    firstName: 'سارة',
    lastName: 'النجفية',
    username: 'sara_najaf',
    avatar: '',
    stage: 'إعدادي',
    grade: 'g12',
    province: 'النجف',
    role: 'student',
    isActive: true,
  },
  {
    id: 'u3',
    firstName: 'علي',
    lastName: 'البغدادي',
    username: 'ali_admin',
    avatar: '',
    stage: 'متوسط',
    grade: 'g9',
    province: 'بغداد',
    role: 'admin',
    isActive: true,
  },
];

function toDate(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

async function main() {
  await client.notification.deleteMany();
  await client.teacher.deleteMany();
  await client.quiz.deleteMany();
  await client.handout.deleteMany();
  await client.video.deleteMany();
  await client.subject.deleteMany();
  await client.grade.deleteMany();
  await client.user.deleteMany();

  await client.user.createMany({ data: users });
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
