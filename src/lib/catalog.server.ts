import { unstable_noStore as noStore } from 'next/cache';
import type { Grade, Handout, Notification, Question } from '@/lib/data';
import {
  adminStats as fallbackAdminStats,
  grades as fallbackGrades,
  handouts as fallbackHandouts,
  notifications as fallbackNotifications,
  provinces,
  quizzes as fallbackQuizzes,
  stages,
  stageToGradeMap,
  subjects as fallbackSubjects,
  teachers as fallbackTeachers,
  videos as fallbackVideos,
} from '@/lib/data';
import type { CatalogData } from '@/lib/catalog-types';
import { prisma } from '@/lib/prisma';

function toDateString(value: Date | string) {
  if (typeof value === 'string') {
    return value;
  }

  return value.toISOString().slice(0, 10);
}

function getFallbackCatalog(): CatalogData {
  return {
    grades: fallbackGrades,
    subjects: fallbackSubjects,
    videos: fallbackVideos,
    handouts: fallbackHandouts,
    quizzes: fallbackQuizzes,
    teachers: fallbackTeachers,
    notifications: fallbackNotifications,
    stages,
    stageToGradeMap,
    adminStats: fallbackAdminStats,
    provinces,
  };
}

export async function getCatalog(): Promise<CatalogData> {
  noStore();

  if (!prisma) {
    return getFallbackCatalog();
  }

  try {
    const [
      grades,
      subjects,
      videos,
      handouts,
      quizzes,
      teachers,
      notifications,
      totalUsers,
      activeUsers,
      totalVideos,
      totalHandouts,
      totalBooks,
      totalQuizzes,
      handoutDownloadSum,
      videoViewSum,
    ] = await Promise.all([
      prisma.grade.findMany({ orderBy: { order: 'asc' } }),
      prisma.subject.findMany({ orderBy: { name: 'asc' } }),
      prisma.video.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' } }),
      prisma.handout.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' } }),
      prisma.quiz.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' } }),
      prisma.teacher.findMany({ orderBy: { name: 'asc' } }),
      prisma.notification.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.video.count({ where: { isActive: true } }),
      prisma.handout.count({ where: { isActive: true, type: { not: 'book' } } }),
      prisma.handout.count({ where: { isActive: true, type: 'book' } }),
      prisma.quiz.count({ where: { isActive: true } }),
      prisma.handout.aggregate({
        _sum: { downloads: true },
        where: { isActive: true },
      }),
      prisma.video.aggregate({
        _sum: { views: true },
        where: { isActive: true },
      }),
    ]);

    return {
      grades: grades.map((grade) => ({
        ...grade,
        stage: grade.stage as Grade['stage'],
      })),
      subjects,
      videos: videos.map((video) => ({
        ...video,
        createdAt: toDateString(video.createdAt),
      })),
      handouts: handouts.map((handout) => ({
        ...handout,
        type: handout.type as Handout['type'],
        createdAt: toDateString(handout.createdAt),
      })),
      quizzes: quizzes.map((quiz) => ({
        ...quiz,
        createdAt: toDateString(quiz.createdAt),
        questions: quiz.questions as unknown as Question[],
      })),
      teachers,
      notifications: notifications.map((notification) => ({
        ...notification,
        type: notification.type as Notification['type'],
        createdAt: toDateString(notification.createdAt),
      })),
      stages,
      stageToGradeMap,
      adminStats: {
        totalUsers,
        totalVideos,
        totalHandouts,
        totalBooks,
        totalQuizzes,
        totalDownloads: handoutDownloadSum._sum.downloads ?? 0,
        totalViews: videoViewSum._sum.views ?? 0,
        activeUsers,
      },
      provinces,
    };
  } catch (error) {
    console.error('Failed to read from database, using fallback data.', error);
    return getFallbackCatalog();
  }
}
