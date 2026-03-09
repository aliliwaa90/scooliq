'use client';

import Link from 'next/link';
import { useCatalog } from '@/components/catalog-provider';
import { BottomNav } from '../page';
import { ArrowRight, Video, Star } from 'lucide-react';

export default function TeachersPage() {
  const { teachers } = useCatalog();

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 glass">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="w-9 h-9 rounded-full surface-elevated flex items-center justify-center">
            <ArrowRight size={18} />
          </Link>
          <h1 className="font-bold text-lg">المدرسين</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4">
        <p className="text-sm text-muted mb-4">نخبة من أفضل المدرسين في العراق</p>

        <div className="space-y-3">
          {teachers.map((t, i) => (
            <div key={t.id} className="card p-4 flex items-center gap-4 fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-lg">
                {t.name.charAt(2)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm">{t.name}</h3>
                <p className="text-xs text-muted mt-0.5">{t.subject}</p>
                <p className="text-xs text-muted mt-1 line-clamp-1">{t.bio}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1 text-xs text-primary font-semibold"><Video size={12} />{t.videoCount} فيديو</span>
                  <span className="flex items-center gap-1 text-xs text-accent"><Star size={12} className="fill-accent" />مميز</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <BottomNav active="home" />
    </div>
  );
}
