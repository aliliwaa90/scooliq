'use client';

import { useCatalog } from '@/components/catalog-provider';
import Link from 'next/link';
import {
  LayoutDashboard, Users, Video, FileText, BookOpen, ClipboardList,
  Bell, Image, Settings, TrendingUp, Download, Eye, ChevronLeft,
  Home, BarChart3, Plus, Search
} from 'lucide-react';

const quickActions = [
  { label: 'إضافة فيديو', icon: <Video size={18} />, href: '/admin/videos', color: '#3B82F6' },
  { label: 'إضافة ملزمة', icon: <FileText size={18} />, href: '/admin/handouts', color: '#10B981' },
  { label: 'إضافة اختبار', icon: <ClipboardList size={18} />, href: '/admin/quizzes', color: '#F59E0B' },
  { label: 'إرسال إشعار', icon: <Bell size={18} />, href: '/admin/notifications', color: '#EF4444' },
];

const sideMenuItems = [
  { icon: <LayoutDashboard size={18} />, label: 'لوحة التحكم', href: '/admin', active: true },
  { icon: <Users size={18} />, label: 'المستخدمين', href: '/admin/users' },
  { icon: <Video size={18} />, label: 'الفيديوهات', href: '/admin/videos' },
  { icon: <FileText size={18} />, label: 'الملازم', href: '/admin/handouts' },
  { icon: <BookOpen size={18} />, label: 'الكتب', href: '/admin/books' },
  { icon: <ClipboardList size={18} />, label: 'الاختبارات', href: '/admin/quizzes' },
  { icon: <Bell size={18} />, label: 'الإشعارات', href: '/admin/notifications' },
  { icon: <Image size={18} />, label: 'البانرات', href: '/admin/banners' },
  { icon: <Settings size={18} />, label: 'الإعدادات', href: '/admin/settings' },
  { icon: <Home size={18} />, label: 'المنصة', href: '/' },
];

export default function AdminDashboard() {
  const { adminStats } = useCatalog();
  const statCards = [
    { label: 'المستخدمين', value: adminStats.totalUsers, icon: <Users size={22} />, color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
    { label: 'الفيديوهات', value: adminStats.totalVideos, icon: <Video size={22} />, color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
    { label: 'الملازم', value: adminStats.totalHandouts, icon: <FileText size={22} />, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
    { label: 'الكتب', value: adminStats.totalBooks, icon: <BookOpen size={22} />, color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
    { label: 'الاختبارات', value: adminStats.totalQuizzes, icon: <ClipboardList size={22} />, color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
    { label: 'التحميلات', value: adminStats.totalDownloads, icon: <Download size={22} />, color: '#06B6D4', bg: 'rgba(6,182,212,0.1)' },
    { label: 'المشاهدات', value: adminStats.totalViews, icon: <Eye size={22} />, color: '#F97316', bg: 'rgba(249,115,22,0.1)' },
    { label: 'المستخدمين النشطين', value: adminStats.activeUsers, icon: <TrendingUp size={22} />, color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 min-h-screen surface border-l border-theme p-4 hidden md:block sticky top-0">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-xl gradient-hero flex items-center justify-center text-white font-bold text-sm">ح</div>
          <div>
            <p className="font-bold text-sm">لوحة التحكم</p>
            <p className="text-[10px] text-muted">حقيبة الطالب العراقي</p>
          </div>
        </div>

        <nav className="space-y-1">
          {sideMenuItems.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                item.active ? 'bg-primary text-white' : 'text-muted hover:surface-elevated hover:text-primary'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 glass p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center text-white font-bold text-xs">ح</div>
          <span className="font-bold text-sm">لوحة التحكم</span>
        </div>
        <Link href="/" className="text-xs text-primary font-semibold">المنصة</Link>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 mt-14 md:mt-0">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">لوحة التحكم</h1>
              <p className="text-sm text-muted mt-1">مرحباً بك في لوحة إدارة المنصة</p>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <div className="relative">
                <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
                <input type="text" placeholder="بحث..." className="input-field text-sm pr-9 w-64" />
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {statCards.map((stat, i) => (
              <div key={i} className="stat-card card p-4 fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: stat.bg, color: stat.color }}>
                    {stat.icon}
                  </div>
                </div>
                <p className="text-2xl font-bold mt-2">{stat.value.toLocaleString('ar-EG')}</p>
                <p className="text-xs text-muted mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-6 fade-in" style={{ animationDelay: '0.3s' }}>
            <h2 className="font-bold text-base mb-3">إجراءات سريعة</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickActions.map((action, i) => (
                <Link
                  key={i}
                  href={action.href}
                  className="card p-4 flex items-center gap-3 hover:scale-[1.02] transition-all"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${action.color}15`, color: action.color }}>
                    <Plus size={16} />
                  </div>
                  <span className="text-sm font-semibold">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card p-5 fade-in" style={{ animationDelay: '0.4s' }}>
            <h2 className="font-bold text-base mb-4">النشاط الأخير</h2>
            <div className="space-y-3">
              {[
                { text: 'تم إضافة فيديو جديد: حل المعادلات التربيعية', time: 'منذ ساعة', icon: <Video size={14} className="text-primary" /> },
                { text: 'تسجيل 15 مستخدم جديد', time: 'منذ 3 ساعات', icon: <Users size={14} className="text-success" /> },
                { text: 'تم رفع ملزمة: العلوم الفصل الثالث', time: 'منذ 5 ساعات', icon: <FileText size={14} className="text-accent" /> },
                { text: 'اختبار جديد: قوانين نيوتن - 245 محاولة', time: 'أمس', icon: <ClipboardList size={14} className="text-error" /> },
                { text: 'تم إرسال إشعار عام للمستخدمين', time: 'أمس', icon: <Bell size={14} className="text-purple-500" /> },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-theme last:border-b-0">
                  <div className="w-8 h-8 rounded-lg surface-elevated flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <p className="text-sm flex-1">{item.text}</p>
                  <span className="text-xs text-muted whitespace-nowrap">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Nav */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-theme p-2">
            <div className="flex justify-around">
              {[
                { icon: <LayoutDashboard size={20} />, label: 'الرئيسية', href: '/admin', active: true },
                { icon: <Video size={20} />, label: 'فيديوهات', href: '/admin/videos' },
                { icon: <FileText size={20} />, label: 'ملازم', href: '/admin/handouts' },
                { icon: <Users size={20} />, label: 'مستخدمين', href: '/admin/users' },
                { icon: <Settings size={20} />, label: 'إعدادات', href: '/admin/settings' },
              ].map((item, i) => (
                <Link key={i} href={item.href} className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl ${item.active ? 'text-primary' : 'text-muted'}`}>
                  {item.icon}
                  <span className="text-[9px] font-semibold">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
