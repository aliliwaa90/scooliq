'use client';

import Link from 'next/link';
import { useCatalog } from '@/components/catalog-provider';
import { useStore } from '@/lib/store';
import { BottomNav } from '../page';
import { ArrowRight, Clock, Video, Eye, Trash2 } from 'lucide-react';

export default function HistoryPage() {
  const { videos, subjects } = useCatalog();
  const { watchHistory } = useStore();
  const historyVideos = watchHistory.map(id => videos.find(v => v.id === id)).filter(Boolean);

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 glass">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/profile" className="w-9 h-9 rounded-full surface-elevated flex items-center justify-center">
            <ArrowRight size={18} />
          </Link>
          <h1 className="font-bold text-lg">سجل المشاهدة</h1>
          <span className="badge badge-primary mr-auto">{historyVideos.length}</span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4">
        {historyVideos.length === 0 ? (
          <div className="text-center mt-16 fade-in">
            <Clock size={56} className="mx-auto text-muted/20 mb-4" />
            <h2 className="font-bold text-lg mb-2">لا يوجد سجل مشاهدة</h2>
            <p className="text-sm text-muted">ستظهر هنا الفيديوهات التي شاهدتها</p>
            <Link href="/videos" className="btn-primary mt-6 inline-flex">تصفح الفيديوهات</Link>
          </div>
        ) : (
          <div className="space-y-2">
            {historyVideos.map((v, i) => {
              if (!v) return null;
              const subj = subjects.find(s => s.id === v.subjectId);
              return (
                <Link key={i} href={`/video/${v.id}`} className="card p-3 flex gap-3 items-center hover:scale-[1.01] transition-all fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="w-20 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-primary-light/20 flex items-center justify-center flex-shrink-0 relative">
                    <Video size={16} className="text-primary/50" />
                    <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded">{v.duration}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold truncate">{v.title}</h4>
                    <p className="text-xs text-muted">{v.teacher}</p>
                    <span className="badge badge-primary text-[10px] mt-1">{subj?.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <BottomNav active="profile" />
    </div>
  );
}
