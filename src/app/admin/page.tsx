'use client';

import Link from 'next/link';
import { useCatalog } from '@/components/catalog-provider';
import { AdminShell } from '@/components/admin/admin-shell';
import {
  Bell,
  ClipboardList,
  Eye,
  FileText,
  Image as ImageIcon,
  Settings,
  TrendingUp,
  Users,
  Video,
} from 'lucide-react';

export default function AdminDashboard() {
  const { adminStats, banners, notifications, siteSettings } = useCatalog();

  const statCards = [
    { label: 'المستخدمون', value: adminStats.totalUsers, icon: <Users size={20} />, color: 'text-primary' },
    { label: 'الفيديوهات', value: adminStats.totalVideos, icon: <Video size={20} />, color: 'text-sky-600' },
    { label: 'الملفات', value: adminStats.totalHandouts + adminStats.totalBooks, icon: <FileText size={20} />, color: 'text-success' },
    { label: 'الاختبارات', value: adminStats.totalQuizzes, icon: <ClipboardList size={20} />, color: 'text-accent' },
    { label: 'المشاهدات', value: adminStats.totalViews, icon: <Eye size={20} />, color: 'text-orange-500' },
    { label: 'المستخدمون النشطون', value: adminStats.activeUsers, icon: <TrendingUp size={20} />, color: 'text-emerald-600' },
  ];

  const quickLinks = [
    { href: '/admin/videos', label: 'إضافة فيديو', icon: <Video size={18} /> },
    { href: '/admin/handouts', label: 'إضافة ملف', icon: <FileText size={18} /> },
    { href: '/admin/quizzes', label: 'إضافة اختبار', icon: <ClipboardList size={18} /> },
    { href: '/admin/notifications', label: 'إرسال إشعار', icon: <Bell size={18} /> },
  ];

  return (
    <AdminShell
      active="dashboard"
      title="لوحة التحكم"
      subtitle="اللوحة أصبحت مرتبطة فعلياً بقاعدة البيانات، وكل الأرقام هنا حقيقية من Supabase."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {statCards.map((card) => (
          <div key={card.label} className="card p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className={`rounded-2xl p-3 surface-elevated ${card.color}`}>{card.icon}</span>
              <p className="text-3xl font-black">{card.value.toLocaleString('ar-EG')}</p>
            </div>
            <p className="text-sm font-semibold text-muted">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
        <div className="space-y-6">
          <div className="card p-5">
            <div className="mb-4 flex items-center gap-2">
              <Settings size={18} className="text-primary" />
              <h2 className="font-bold">إعدادات المنصة الحالية</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl surface-elevated p-4">
                <p className="text-xs font-bold text-muted">اسم المنصة</p>
                <p className="mt-1 font-bold">{siteSettings.siteName}</p>
              </div>
              <div className="rounded-2xl surface-elevated p-4">
                <p className="text-xs font-bold text-muted">معرف تيليجرام</p>
                <p className="mt-1 font-bold">{siteSettings.telegramHandle || 'غير محدد'}</p>
              </div>
              <div className="rounded-2xl surface-elevated p-4">
                <p className="text-xs font-bold text-muted">وضع الصيانة</p>
                <p className="mt-1 font-bold">{siteSettings.maintenanceMode ? 'مفعل' : 'متوقف'}</p>
              </div>
              <div className="rounded-2xl surface-elevated p-4">
                <p className="text-xs font-bold text-muted">التسجيل</p>
                <p className="mt-1 font-bold">{siteSettings.allowRegistration ? 'مفتوح' : 'مغلق'}</p>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <div className="mb-4 flex items-center gap-2">
              <ImageIcon size={18} className="text-accent" />
              <h2 className="font-bold">البانرات الحالية</h2>
            </div>
            <div className="space-y-3">
              {banners.slice(0, 3).map((banner) => (
                <div key={banner.id} className="rounded-2xl border border-theme p-4">
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <h3 className="font-bold">{banner.title}</h3>
                    <span className={`badge text-[10px] ${banner.isActive ? 'badge-success' : 'badge-primary'}`}>
                      {banner.isActive ? 'نشط' : 'مخفي'}
                    </span>
                  </div>
                  <p className="text-sm text-muted">{banner.subtitle}</p>
                  <p className="mt-2 text-xs text-muted">{banner.linkUrl}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-5">
            <h2 className="mb-4 font-bold">اختصارات سريعة</h2>
            <div className="grid gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 rounded-2xl surface-elevated px-4 py-3 text-sm font-bold transition-all hover:text-primary"
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <div className="mb-4 flex items-center gap-2">
              <Bell size={18} className="text-error" />
              <h2 className="font-bold">آخر الإشعارات</h2>
            </div>
            <div className="space-y-3">
              {notifications.slice(0, 5).map((notification) => (
                <div key={notification.id} className="rounded-2xl border border-theme p-4">
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <h3 className="font-bold">{notification.title}</h3>
                    <span className="text-xs text-muted">{notification.createdAt}</span>
                  </div>
                  <p className="text-sm text-muted">{notification.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
