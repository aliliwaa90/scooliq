import type {
  Banner,
  CatalogUser,
  Grade,
  Handout,
  Notification,
  Quiz,
  SiteSetting,
  Subject,
  Teacher,
  Video,
} from '@/lib/data';

export interface StageMeta {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  gradeCount: number;
}

export interface AdminStats {
  totalUsers: number;
  totalVideos: number;
  totalHandouts: number;
  totalBooks: number;
  totalQuizzes: number;
  totalDownloads: number;
  totalViews: number;
  activeUsers: number;
}

export interface CatalogData {
  grades: Grade[];
  subjects: Subject[];
  videos: Video[];
  handouts: Handout[];
  quizzes: Quiz[];
  teachers: Teacher[];
  notifications: Notification[];
  banners: Banner[];
  siteSettings: SiteSetting;
  stages: StageMeta[];
  stageToGradeMap: Record<string, string>;
  adminStats: AdminStats;
  provinces: string[];
}

export interface AdminUserListData {
  users: CatalogUser[];
}
