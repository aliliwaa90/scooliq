'use client';

import Link from 'next/link';
import { useCatalog } from '@/components/catalog-provider';
import { BottomNav } from '../page';
import { ArrowRight, FileText, Download, Star, Eye } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '@/lib/store';

export default function HandoutsPage() {
  const { handouts, subjects } = useCatalog();
  const [filter, setFilter] = useState<'all' | 'handout' | 'summary'>('all');
  const { favorites, addFavorite, removeFavorite } = useStore();

  const filtered = filter === 'all' ? handouts.filter(h => h.type !== 'book') : handouts.filter(h => h.type === filter);
  const typeLabels: Record<string, string> = { handout: 'ملزمة', summary: 'ملخص' };

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 glass">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="w-9 h-9 rounded-full surface-elevated flex items-center justify-center">
            <ArrowRight size={18} />
          </Link>
          <h1 className="font-bold text-lg">الملازم والملخصات</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-3">
        <div className="flex gap-2 mb-4">
          {(['all', 'handout', 'summary'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${filter === f ? 'bg-primary text-white' : 'surface-elevated text-muted'}`}>
              {f === 'all' ? 'الكل' : f === 'handout' ? 'ملازم' : 'ملخصات'}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((h, i) => {
            const subj = subjects.find(s => s.id === h.subjectId);
            const isFav = favorites.includes(h.id);
            return (
              <div key={h.id} className="card p-4 fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="flex gap-3 items-start">
                  <div className="w-14 h-16 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: subj ? `${subj.color}15` : 'rgba(16,185,129,0.1)' }}>
                    <FileText size={24} style={{ color: subj?.color || '#10B981' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold">{h.title}</h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="badge badge-primary text-[10px]">{typeLabels[h.type] || h.type}</span>
                      <span className="badge badge-accent text-[10px]">{subj?.name}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted">
                      <span>📄 PDF</span>
                      <span>{h.fileSize}</span>
                      <span className="flex items-center gap-1"><Download size={11} />{h.downloads.toLocaleString('ar-EG')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="btn-primary flex-1 text-xs py-2">
                    <Download size={14} />
                    تحميل
                  </button>
                  <button className="btn-secondary text-xs py-2 px-3">
                    <Eye size={14} />
                    عرض
                  </button>
                  <button
                    onClick={() => isFav ? removeFavorite(h.id) : addFavorite(h.id)}
                    className="btn-secondary text-xs py-2 px-3"
                  >
                    <Star size={14} className={isFav ? 'fill-accent text-accent' : ''} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <BottomNav active="home" />
    </div>
  );
}
