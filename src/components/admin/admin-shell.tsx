'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import {
  Bell,
  ClipboardList,
  FileText,
  Home,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  Video,
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'لوحة التحكم', href: '/admin', icon: <LayoutDashboard size={18} /> },
  { id: 'users', label: 'المستخدمون', href: '/admin/users', icon: <Users size={18} /> },
  { id: 'videos', label: 'الفيديوهات', href: '/admin/videos', icon: <Video size={18} /> },
  { id: 'handouts', label: 'الملفات', href: '/admin/handouts', icon: <FileText size={18} /> },
  { id: 'quizzes', label: 'الاختبارات', href: '/admin/quizzes', icon: <ClipboardList size={18} /> },
  { id: 'notifications', label: 'الإشعارات', href: '/admin/notifications', icon: <Bell size={18} /> },
  { id: 'banners', label: 'البانرات', href: '/admin/banners', icon: <ImageIcon size={18} /> },
  { id: 'settings', label: 'الإعدادات', href: '/admin/settings', icon: <Settings size={18} /> },
  { id: 'home', label: 'المنصة', href: '/', icon: <Home size={18} /> },
];

function AdminLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/logout', {
      method: 'POST',
    });
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="inline-flex items-center gap-2 rounded-xl border border-theme px-3 py-2 text-sm font-semibold text-muted transition-all hover:text-error hover:border-error/30"
      type="button"
    >
      <LogOut size={16} />
      تسجيل الخروج
    </button>
  );
}

function AdminSidebar({ active }: { active: string }) {
  return (
    <aside className="sticky top-0 hidden min-h-screen w-64 border-l border-theme surface p-4 md:block">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl gradient-hero text-sm font-black text-white">
          س
        </div>
        <div>
          <p className="font-bold">لوحة التحكم</p>
          <p className="text-xs text-muted">Scooliq Admin</p>
        </div>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
              active === item.id ? 'bg-primary text-white' : 'text-muted hover:surface-elevated hover:text-primary'
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

function AdminMobileNav({ active }: { active: string }) {
  const mobileItems = navItems.filter((item) =>
    ['dashboard', 'videos', 'handouts', 'users', 'settings'].includes(item.id),
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-theme glass p-2 md:hidden">
      <div className="flex justify-around">
        {mobileItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`flex flex-col items-center gap-1 rounded-xl p-1.5 ${
              active === item.id ? 'text-primary' : 'text-muted'
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-semibold">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function AdminShell({
  active,
  title,
  subtitle,
  actions,
  children,
}: {
  active: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <AdminSidebar active={active} />

      <div className="flex-1">
        <div className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between border-b border-theme glass px-4 py-3 md:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl gradient-hero text-xs font-black text-white">
              س
            </div>
            <span className="text-sm font-bold">الإدارة</span>
          </div>
          <AdminLogoutButton />
        </div>

        <main className="p-4 pb-24 pt-16 md:p-6 md:pt-6">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-black">{title}</h1>
                {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
              </div>
              <div className="hidden md:block">
                <AdminLogoutButton />
              </div>
              {actions ? <div className="w-full md:w-auto">{actions}</div> : null}
            </div>

            {children}
          </div>
        </main>

        <AdminMobileNav active={active} />
      </div>
    </div>
  );
}
