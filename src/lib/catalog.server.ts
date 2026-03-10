import { unstable_noStore as noStore } from 'next/cache';
import type {
  Banner,
  Grade,
  Handout,
  Notification,
  Question,
  SiteSetting,
  Subject,
} from '@/lib/data';
import {
  adminStats as fallbackAdminStats,
  banners as fallbackBanners,
  grades as fallbackGrades,
  handouts as fallbackHandouts,
  notifications as fallbackNotifications,
  provinces,
  quizzes as fallbackQuizzes,
  siteSettings as fallbackSiteSettings,
  stages,
  stageToGradeMap,
  subjects as fallbackSubjects,
  teachers as fallbackTeachers,
  users as fallbackUsers,
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

function withComputedSubjectCounts(
  subjects: Subject[],
  handouts: CatalogData['handouts'],
  quizzes: CatalogData['quizzes'],
  videos: CatalogData['videos'],
) {
  return subjects.map((subject) => ({
    ...subject,
    videoCount: videos.filter((video) => video.subjectId === subject.id && video.isActive).length,
    handoutCount: handouts.filter(
      (handout) => handout.subjectId === subject.id && handout.isActive && handout.type !== 'book',
    ).length,
    bookCount: handouts.filter(
      (handout) => handout.subjectId === subject.id && handout.isActive && handout.type === 'book',
    ).length,
    quizCount: quizzes.filter((quiz) => quiz.subjectId === subject.id && quiz.isActive).length,
  }));
}

function getFallbackCatalog(): CatalogData {
  return {
    grades: fallbackGrades,
    subjects: withComputedSubjectCounts(
      fallbackSubjects,
      fallbackHandouts,
      fallbackQuizzes,
      fallbackVideos,
    ),
    videos: fallbackVideos,
    handouts: fallbackHandouts,
    quizzes: fallbackQuizzes,
    teachers: fallbackTeachers,
    notifications: fallbackNotifications,
    banners: fallbackBanners,
    siteSettings: fallbackSiteSettings,
    stages,
    stageToGradeMap,
    adminStats: {
      ...fallbackAdminStats,
      totalUsers: fallbackUsers.length,
      activeUsers: fallbackUsers.filter((user) => user.isActive).length,
    },
    provinces,
  };
}

function mapSiteSettings(settings: {
  id: string;
  siteName: string;
  siteDescription: string;
  telegramHandle: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  updatedAt: Date | string;
}): SiteSetting {
  return {
    ...settings,
    updatedAt: toDateString(settings.updatedAt),
  };
}

function mapBanners(
  banners: Array<{
    id: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    linkUrl: string;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date | string;
  }>,
): Banner[] {
  return banners.map((banner) => ({
    ...banner,
    createdAt: toDateString(banner.createdAt),
  }));
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
      banners,
      siteSettings,
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
      prisma.subject.findMany({ orderBy: [{ gradeId: 'asc' }, { name: 'asc' }] }),
      prisma.video.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' } }),
      prisma.handout.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' } }),
      prisma.quiz.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' } }),
      prisma.teacher.findMany({ orderBy: { name: 'asc' } }),
      prisma.notification.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.banner.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] }),
      prisma.siteSetting.findUnique({ where: { id: 'main' } }),
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

    const mappedVideos = videos.map((video) => ({
      ...video,
      createdAt: toDateString(video.createdAt),
    }));
    const mappedHandouts = handouts.map((handout) => ({
      ...handout,
      type: handout.type as Handout['type'],
      createdAt: toDateString(handout.createdAt),
    }));
    const mappedQuizzes = quizzes.map((quiz) => ({
      ...quiz,
      createdAt: toDateString(quiz.createdAt),
      questions: quiz.questions as unknown as Question[],
    }));

    return {
      grades: grades.map((grade) => ({
        ...grade,
        stage: grade.stage as Grade['stage'],
      })),
      subjects: withComputedSubjectCounts(
        subjects.map((subject) => ({
          ...subject,
          videoCount: subject.videoCount ?? 0,
          handoutCount: subject.handoutCount ?? 0,
          bookCount: subject.bookCount ?? 0,
          quizCount: subject.quizCount ?? 0,
        })),
        mappedHandouts,
        mappedQuizzes,
        mappedVideos,
      ),
      videos: mappedVideos,
      handouts: mappedHandouts,
      quizzes: mappedQuizzes,
      teachers,
      notifications: notifications.map((notification) => ({
        ...notification,
        type: notification.type as Notification['type'],
        audience: notification.audience,
        createdAt: toDateString(notification.createdAt),
      })),
      banners: mapBanners(banners),
      siteSettings: siteSettings
        ? mapSiteSettings(siteSettings)
        : fallbackSiteSettings,
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
