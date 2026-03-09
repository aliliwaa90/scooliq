'use client';

import Link from 'next/link';
import { useCatalog } from '@/components/catalog-provider';
import { BottomNav } from '../page';
import { ArrowRight, Bell, Video, ClipboardList, BookOpen, Megaphone, Check } from 'lucide-react';
import { useState } from 'react';

export default function NotificationsPage() {
  const { notifications: notifData } = useCatalog();
  const [notifs, setNotifs] = useState(notifData);

  const markAllRead = () => { setNotifs(notifs.map(n => ({ ...n, isRead: true }))); };

  const typeIcons: Record<string, React.ReactNode> = {
    content: <Video size={18} className="text-primary" />,
    quiz: <ClipboardList size={18} className="text-accent" />,
    review: <BookOpen size={18} className="text-success" />,
    announcement: <Megaphone size={18} className="text-error" />,
  };

  const typeColors: Record<string, string> = {
    content: 'rgba(26,86,219,0.1)',
    quiz: 'rgba(245,158,11,0.1)',
    review: 'rgba(16,185,129,0.1)',
    announcement: 'rgba(239,68,68,0.1)',
  };

  const unreadCount = notifs.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 glass">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-9 h-9 rounded-full surface-elevated flex items-center justify-center">
              <ArrowRight size={18} />
            </Link>
            <h1 className="font-bold text-lg">الإشعارات</h1>
            {unreadCount > 0 && <span className="badge bg-error text-white">{unreadCount}</span>}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-xs text-primary font-semibold flex items-center gap-1">
              <Check size={14} />
              قراءة الكل
            </button>
          )}
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4">
        {notifs.length === 0 ? (
          <div className="text-center mt-16">
            <Bell size={48} className="mx-auto text-muted/20 mb-4" />
            <p className="text-sm text-muted">لا توجد إشعارات</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifs.map((n, i) => (
              <div
                key={n.id}
                className={`card p-4 flex gap-3 fade-in ${!n.isRead ? 'border-r-4 border-r-primary' : ''}`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: typeColors[n.type] }}>
                  {typeIcons[n.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold">{n.title}</h3>
                    {!n.isRead && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                  </div>
                  <p className="text-xs text-muted mt-1">{n.message}</p>
                  <p className="text-[10px] text-muted mt-2">{n.createdAt}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNav active="home" />
    </div>
  );
}
