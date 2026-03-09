'use client';

import { useCatalog } from '@/components/catalog-provider';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { BottomNav } from '../page';
import { ArrowRight, Star, Video, FileText, Trash2, Eye, Download } from 'lucide-react';

export default function FavoritesPage() {
  const { videos, handouts } = useCatalog();
  const { favorites, removeFavorite } = useStore();

  const favVideos = videos.filter(v => favorites.includes(v.id));
  const favHandouts = handouts.filter(h => favorites.includes(h.id));

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 glass">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="w-9 h-9 rounded-full surface-elevated flex items-center justify-center">
            <ArrowRight size={18} />
          </Link>
          <h1 className="font-bold text-lg">المفضلة</h1>
          <span className="badge badge-accent mr-auto">{favorites.length}</span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4">
        {favorites.length === 0 ? (
          <div className="text-center mt-16 fade-in">
            <Star size={56} className="mx-auto text-muted/20 mb-4" />
            <h2 className="font-bold text-lg mb-2">لا توجد عناصر محفوظة</h2>
            <p className="text-sm text-muted">احفظ الفيديوهات والملازم المفضلة لديك للوصول السريع</p>
            <Link href="/" className="btn-primary mt-6 inline-flex">تصفح المحتوى</Link>
          </div>
        ) : (
          <div className="fade-in">
            {favVideos.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><Video size={16} className="text-primary" />فيديوهات ({favVideos.length})</h3>
                <div className="space-y-2">
                  {favVideos.map(v => (
                    <div key={v.id} className="card p-3 flex gap-3 items-center">
                      <Link href={`/video/${v.id}`} className="flex gap-3 items-center flex-1 min-w-0">
                        <div className="w-20 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-primary-light/20 flex items-center justify-center flex-shrink-0">
                          <Video size={16} className="text-primary/50" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold truncate">{v.title}</h4>
                          <p className="text-xs text-muted">{v.teacher}</p>
                        </div>
                      </Link>
                      <button onClick={() => removeFavorite(v.id)} className="w-8 h-8 rounded-full surface-elevated flex items-center justify-center hover:bg-error/10">
                        <Trash2 size={14} className="text-error" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {favHandouts.length > 0 && (
              <div>
                <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><FileText size={16} className="text-success" />ملازم وكتب ({favHandouts.length})</h3>
                <div className="space-y-2">
                  {favHandouts.map(h => (
                    <div key={h.id} className="card p-3 flex gap-3 items-center">
                      <div className="w-10 h-12 rounded-lg bg-gradient-to-br from-success/20 to-success/10 flex items-center justify-center flex-shrink-0">
                        <FileText size={16} className="text-success" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold truncate">{h.title}</h4>
                        <span className="text-xs text-muted">{h.fileSize}</span>
                      </div>
                      <button onClick={() => removeFavorite(h.id)} className="w-8 h-8 rounded-full surface-elevated flex items-center justify-center hover:bg-error/10">
                        <Trash2 size={14} className="text-error" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <BottomNav active="favorites" />
    </div>
  );
}
