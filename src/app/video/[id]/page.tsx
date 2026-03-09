'use client';

import { useCatalog } from '@/components/catalog-provider';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useStore } from '@/lib/store';
import { ArrowRight, Eye, Clock, Share2, Star, BookmarkPlus, Video, ChevronLeft } from 'lucide-react';
import { useEffect } from 'react';

export default function VideoPage() {
  const { videos, subjects } = useCatalog();
  const params = useParams();
  const videoId = params.id as string;
  const video = videos.find(v => v.id === videoId);
  const { favorites, addFavorite, removeFavorite, addToHistory } = useStore();

  useEffect(() => {
    if (video) addToHistory(video.id);
  }, [video, addToHistory]);

  if (!video) {
    return <div className="min-h-screen flex items-center justify-center"><p>الفيديو غير موجود</p></div>;
  }

  const subject = subjects.find(s => s.id === video.subjectId);
  const isFav = favorites.includes(video.id);
  const related = videos.filter(v => v.subjectId === video.subjectId && v.id !== video.id).slice(0, 4);

  return (
    <div className="min-h-screen pb-8">
      {/* Video Player */}
      <div className="relative bg-black">
        <div className="absolute top-3 right-3 z-10">
          <Link href={`/subject/${video.subjectId}`} className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white">
            <ArrowRight size={18} />
          </Link>
        </div>
        <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3 cursor-pointer hover:bg-white/30 transition-all">
              <div className="w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-r-0 border-l-[20px] border-l-white mr-[-3px]"></div>
            </div>
            <p className="text-sm opacity-70">اضغط للتشغيل</p>
          </div>
        </div>
      </div>

      <main className="max-w-lg mx-auto px-4">
        {/* Video Info */}
        <div className="mt-4">
          <div className="flex items-start gap-2">
            <span className="badge badge-primary mt-0.5">{subject?.name}</span>
            {!video.isFree && <span className="badge badge-accent mt-0.5">مميز</span>}
          </div>
          <h1 className="text-xl font-bold mt-2">{video.title}</h1>
          <p className="text-sm text-muted mt-2">{video.description}</p>

          <div className="flex items-center gap-4 mt-3 text-sm text-muted">
            <span className="flex items-center gap-1"><Eye size={14} />{video.views.toLocaleString('ar-EG')} مشاهدة</span>
            <span className="flex items-center gap-1"><Clock size={14} />{video.duration}</span>
          </div>

          {/* Teacher */}
          <div className="card p-3 mt-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold">
              {video.teacher.charAt(2)}
            </div>
            <div>
              <p className="font-semibold text-sm">{video.teacher}</p>
              <p className="text-xs text-muted">{video.chapter} • {video.lesson}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => isFav ? removeFavorite(video.id) : addFavorite(video.id)}
              className="btn-secondary flex-1"
            >
              <Star size={16} className={isFav ? 'fill-accent text-accent' : ''} />
              {isFav ? 'في المفضلة' : 'حفظ'}
            </button>
            <button className="btn-secondary flex-1">
              <Share2 size={16} />
              مشاركة
            </button>
            <button className="btn-secondary flex-1">
              <BookmarkPlus size={16} />
              لاحقاً
            </button>
          </div>
        </div>

        {/* Related Videos */}
        {related.length > 0 && (
          <div className="mt-6">
            <h2 className="font-bold text-base mb-3">فيديوهات مشابهة</h2>
            <div className="space-y-2">
              {related.map(rv => (
                <Link key={rv.id} href={`/video/${rv.id}`} className="card p-3 flex gap-3 items-center hover:scale-[1.01] transition-all">
                  <div className="w-24 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary-light/20 flex items-center justify-center flex-shrink-0 relative">
                    <Video size={18} className="text-primary/50" />
                    <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded">{rv.duration}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold line-clamp-2">{rv.title}</h3>
                    <p className="text-xs text-muted mt-1">{rv.teacher}</p>
                    <span className="text-xs text-muted flex items-center gap-1 mt-1"><Eye size={11} />{rv.views.toLocaleString('ar-EG')}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
