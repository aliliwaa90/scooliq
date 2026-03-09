'use client';

import { useCatalog } from '@/components/catalog-provider';
import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowRight, Video, Plus, Search, Edit, Trash2, Eye, EyeOff,
  LayoutDashboard, Users, FileText, BookOpen, ClipboardList, Bell,
  Image, Settings, Home, X, Save
} from 'lucide-react';

export default function AdminVideos() {
  const { videos, subjects, grades } = useCatalog();
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const filtered = videos.filter(v => v.title.includes(searchQuery) || v.teacher.includes(searchQuery));

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <AdminSidebar active="videos" />

      <main className="flex-1 p-4 md:p-6 mt-14 md:mt-0">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h1 className="text-xl font-bold">إدارة الفيديوهات</h1>
              <p className="text-sm text-muted">{videos.length} فيديو</p>
            </div>
            <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">
              <Plus size={16} />
              إضافة فيديو
            </button>
          </div>

          {/* Add Form */}
          {showForm && (
            <div className="card p-5 mb-6 fade-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">إضافة فيديو جديد</h3>
                <button onClick={() => setShowForm(false)}><X size={18} className="text-muted" /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input placeholder="عنوان الفيديو" className="input-field text-sm" />
                <input placeholder="رابط الفيديو (YouTube)" className="input-field text-sm" dir="ltr" style={{ textAlign: 'right' }} />
                <input placeholder="اسم المدرس" className="input-field text-sm" />
                <input placeholder="المدة (مثال: 30:00)" className="input-field text-sm" />
                <select className="input-field text-sm">
                  <option value="">اختر المادة</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name} - {grades.find(g => g.id === s.gradeId)?.name}</option>)}
                </select>
                <input placeholder="الفصل / الوحدة" className="input-field text-sm" />
                <input placeholder="الدرس" className="input-field text-sm" />
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
                    مجاني
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
                    فعّال
                  </label>
                </div>
              </div>
              <textarea placeholder="وصف الفيديو" className="input-field text-sm mt-3 min-h-[80px] resize-none" />
              <button className="btn-primary mt-3 text-sm"><Save size={14} />حفظ</button>
            </div>
          )}

          {/* Search */}
          <div className="relative mb-4">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="ابحث في الفيديوهات..."
              className="input-field text-sm pr-9"
            />
          </div>

          {/* Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="surface-elevated text-right">
                    <th className="p-3 font-semibold text-muted">#</th>
                    <th className="p-3 font-semibold text-muted">العنوان</th>
                    <th className="p-3 font-semibold text-muted hidden md:table-cell">المدرس</th>
                    <th className="p-3 font-semibold text-muted hidden md:table-cell">المادة</th>
                    <th className="p-3 font-semibold text-muted hidden md:table-cell">المشاهدات</th>
                    <th className="p-3 font-semibold text-muted">الحالة</th>
                    <th className="p-3 font-semibold text-muted">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((v, i) => {
                    const subj = subjects.find(s => s.id === v.subjectId);
                    return (
                      <tr key={v.id} className="border-t border-theme hover:surface-elevated transition-all">
                        <td className="p-3 text-muted">{i + 1}</td>
                        <td className="p-3">
                          <p className="font-semibold truncate max-w-[200px]">{v.title}</p>
                          <p className="text-xs text-muted md:hidden">{v.teacher}</p>
                        </td>
                        <td className="p-3 hidden md:table-cell text-muted">{v.teacher}</td>
                        <td className="p-3 hidden md:table-cell"><span className="badge badge-primary text-[10px]">{subj?.name}</span></td>
                        <td className="p-3 hidden md:table-cell text-muted">{v.views.toLocaleString('ar-EG')}</td>
                        <td className="p-3">
                          {v.isActive ? (
                            <span className="badge badge-success text-[10px]">فعّال</span>
                          ) : (
                            <span className="badge bg-error/10 text-error text-[10px]">معطّل</span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <button className="w-7 h-7 rounded-lg surface-elevated flex items-center justify-center hover:text-primary transition-all"><Edit size={13} /></button>
                            <button className="w-7 h-7 rounded-lg surface-elevated flex items-center justify-center hover:text-error transition-all"><Trash2 size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Bottom Nav */}
          <AdminMobileNav active="videos" />
        </div>
      </main>
    </div>
  );
}

// ===== SHARED ADMIN COMPONENTS =====

export function AdminSidebar({ active }: { active: string }) {
  const items = [
    { id: 'dashboard', icon: <LayoutDashboard size={18} />, label: 'لوحة التحكم', href: '/admin' },
    { id: 'users', icon: <Users size={18} />, label: 'المستخدمين', href: '/admin/users' },
    { id: 'videos', icon: <Video size={18} />, label: 'الفيديوهات', href: '/admin/videos' },
    { id: 'handouts', icon: <FileText size={18} />, label: 'الملازم', href: '/admin/handouts' },
    { id: 'books', icon: <BookOpen size={18} />, label: 'الكتب', href: '/admin/books' },
    { id: 'quizzes', icon: <ClipboardList size={18} />, label: 'الاختبارات', href: '/admin/quizzes' },
    { id: 'notifications', icon: <Bell size={18} />, label: 'الإشعارات', href: '/admin/notifications' },
    { id: 'banners', icon: <Image size={18} />, label: 'البانرات', href: '/admin/banners' },
    { id: 'settings', icon: <Settings size={18} />, label: 'الإعدادات', href: '/admin/settings' },
    { id: 'home', icon: <Home size={18} />, label: 'المنصة', href: '/' },
  ];

  return (
    <>
      <aside className="w-64 min-h-screen surface border-l border-theme p-4 hidden md:block sticky top-0">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-xl gradient-hero flex items-center justify-center text-white font-bold text-sm">ح</div>
          <div>
            <p className="font-bold text-sm">لوحة التحكم</p>
            <p className="text-[10px] text-muted">حقيبة الطالب العراقي</p>
          </div>
        </div>
        <nav className="space-y-1">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                active === item.id ? 'bg-primary text-white' : 'text-muted hover:surface-elevated hover:text-primary'
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
    </>
  );
}

export function AdminMobileNav({ active }: { active: string }) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-theme p-2 z-50">
      <div className="flex justify-around">
        {[
          { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'الرئيسية', href: '/admin' },
          { id: 'videos', icon: <Video size={20} />, label: 'فيديوهات', href: '/admin/videos' },
          { id: 'handouts', icon: <FileText size={20} />, label: 'ملازم', href: '/admin/handouts' },
          { id: 'users', icon: <Users size={20} />, label: 'مستخدمين', href: '/admin/users' },
          { id: 'settings', icon: <Settings size={20} />, label: 'إعدادات', href: '/admin/settings' },
        ].map((item) => (
          <Link key={item.id} href={item.href} className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl ${active === item.id ? 'text-primary' : 'text-muted'}`}>
            {item.icon}
            <span className="text-[9px] font-semibold">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
