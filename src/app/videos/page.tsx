'use client';

import { useCatalog } from '@/components/catalog-provider';
import Link from 'next/link';
import { BottomNav } from '../page';
import { ArrowRight, Video, Eye, Clock, Filter } from 'lucide-react';
import { useState } from 'react';

export default function VideosPage() {
  const { videos, subjects } = useCatalog();
  const [selectedSubject, setSelectedSubject] = useState('all');
  const uniqueSubjects = subjects.filter((s, i, arr) => arr.findIndex(x => x.name === s.name) === i);

  const filtered = selectedSubject === 'all' ? videos : videos.filter(v => {
    const subj = subjects.find(s => s.id === v.subjectId);
    return subj?.name === selectedSubject;
  });

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 glass">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="w-9 h-9 rounded-full surface-elevated flex items-center justify-center">
            <ArrowRight size={18} />
          </Link>
          <h1 className="font-bold text-lg">الفيديوهات</h1>
          <span className="badge badge-primary mr-auto">{filtered.length}</span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-3">
        {/* Subject Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-3">
          <button onClick={() => setSelectedSubject('all')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${selectedSubject === 'all' ? 'bg-primary text-white' : 'surface-elevated text-muted'}`}>
            الكل
          </button>
          {uniqueSubjects.map(s => (
            <button key={s.id} onClick={() => setSelectedSubject(s.name)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${selectedSubject === s.name ? 'bg-primary text-white' : 'surface-elevated text-muted'}`}>
              {s.icon} {s.name}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((video, i) => {
            const subj = subjects.find(s => s.id === video.subjectId);
            return (
              <Link key={video.id} href={`/video/${video.id}`} className="card overflow-hidden hover:scale-[1.01] transition-all fade-in flex" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="w-32 h-24 bg-gradient-to-br from-primary/20 to-primary-light/20 flex items-center justify-center flex-shrink-0 relative">
                  <Video size={24} className="text-primary/40" />
                  <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded">{video.duration}</span>
                </div>
                <div className="p-3 flex-1 min-w-0">
                  <h3 className="text-sm font-bold line-clamp-2">{video.title}</h3>
                  <p className="text-xs text-muted mt-1">{video.teacher}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="badge badge-primary text-[10px]">{subj?.name}</span>
                    <span className="flex items-center gap-1 text-xs text-muted"><Eye size={11} />{video.views.toLocaleString('ar-EG')}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <BottomNav active="home" />
    </div>
  );
}
