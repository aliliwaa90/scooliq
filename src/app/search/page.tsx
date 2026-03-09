'use client';

import { useState } from 'react';
import { useCatalog } from '@/components/catalog-provider';
import Link from 'next/link';
import { BottomNav } from '../page';
import { Search as SearchIcon, Video, FileText, ClipboardList, ArrowRight, X } from 'lucide-react';

type FilterType = 'all' | 'video' | 'handout' | 'quiz';

export default function SearchPage() {
  const { videos, handouts, quizzes, subjects } = useCatalog();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const results = (() => {
    if (!query.trim()) return { videos: [], handouts: [], quizzes: [] };

    const q = query.toLowerCase();
    return {
      videos: filter === 'all' || filter === 'video' ? videos.filter(v =>
        v.title.toLowerCase().includes(q) || v.teacher.toLowerCase().includes(q) || v.chapter.includes(q)
      ) : [],
      handouts: filter === 'all' || filter === 'handout' ? handouts.filter(h =>
        h.title.toLowerCase().includes(q)
      ) : [],
      quizzes: filter === 'all' || filter === 'quiz' ? quizzes.filter(qz =>
        qz.title.toLowerCase().includes(q) || qz.chapter.includes(q)
      ) : [],
    };
  })();

  const totalResults = results.videos.length + results.handouts.length + results.quizzes.length;

  const suggestions = ['الرياضيات', 'المعادلات', 'نيوتن', 'القواعد', 'English', 'الكيمياء'];

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 glass">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            <Link href="/" className="w-9 h-9 rounded-full surface-elevated flex items-center justify-center flex-shrink-0">
              <ArrowRight size={18} />
            </Link>
            <div className="flex-1 relative">
              <SearchIcon size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث عن فيديو، ملزمة، اختبار..."
                className="input-field pr-10"
                autoFocus
              />
              {query && (
                <button onClick={() => setQuery('')} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted hover:text-error">
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mt-3 overflow-x-auto">
            {([
              { id: 'all' as FilterType, label: 'الكل' },
              { id: 'video' as FilterType, label: 'فيديوهات', icon: <Video size={14} /> },
              { id: 'handout' as FilterType, label: 'ملازم وكتب', icon: <FileText size={14} /> },
              { id: 'quiz' as FilterType, label: 'اختبارات', icon: <ClipboardList size={14} /> },
            ]).map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  filter === f.id ? 'bg-primary text-white' : 'surface-elevated text-muted'
                }`}
              >
                {f.icon}{f.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4">
        {!query.trim() ? (
          <div className="fade-in">
            <p className="text-sm font-semibold mb-3">اقتراحات البحث</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="badge badge-primary cursor-pointer hover:scale-105 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="mt-8 text-center">
              <SearchIcon size={48} className="mx-auto text-muted/30 mb-3" />
              <p className="text-sm text-muted">ابحث عن أي محتوى تعليمي</p>
            </div>
          </div>
        ) : totalResults === 0 ? (
          <div className="text-center mt-12 fade-in">
            <SearchIcon size={48} className="mx-auto text-muted/30 mb-3" />
            <p className="font-semibold">لا توجد نتائج</p>
            <p className="text-sm text-muted mt-1">جرّب البحث بكلمات أخرى</p>
          </div>
        ) : (
          <div className="fade-in">
            <p className="text-sm text-muted mb-3">{totalResults} نتيجة</p>

            {results.videos.length > 0 && (
              <div className="mb-5">
                <h3 className="font-bold text-sm mb-2 flex items-center gap-2"><Video size={16} className="text-primary" />فيديوهات ({results.videos.length})</h3>
                <div className="space-y-2">
                  {results.videos.map(v => {
                    const subj = subjects.find(s => s.id === v.subjectId);
                    return (
                      <Link key={v.id} href={`/video/${v.id}`} className="card p-3 flex gap-3 items-center hover:scale-[1.01] transition-all">
                        <div className="w-16 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary-light/20 flex items-center justify-center flex-shrink-0">
                          <Video size={16} className="text-primary/50" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold truncate">{v.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted">{v.teacher}</span>
                            <span className="badge badge-primary text-[10px]">{subj?.name}</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {results.handouts.length > 0 && (
              <div className="mb-5">
                <h3 className="font-bold text-sm mb-2 flex items-center gap-2"><FileText size={16} className="text-success" />ملازم وكتب ({results.handouts.length})</h3>
                <div className="space-y-2">
                  {results.handouts.map(h => (
                    <div key={h.id} className="card p-3 flex gap-3 items-center">
                      <div className="w-10 h-12 rounded-lg bg-gradient-to-br from-success/20 to-success/10 flex items-center justify-center flex-shrink-0">
                        <FileText size={16} className="text-success" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold truncate">{h.title}</h4>
                        <span className="text-xs text-muted">{h.fileSize}</span>
                      </div>
                      <button className="btn-primary text-xs px-3 py-1.5">تحميل</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.quizzes.length > 0 && (
              <div className="mb-5">
                <h3 className="font-bold text-sm mb-2 flex items-center gap-2"><ClipboardList size={16} className="text-accent" />اختبارات ({results.quizzes.length})</h3>
                <div className="space-y-2">
                  {results.quizzes.map(q => (
                    <Link key={q.id} href={`/quiz/${q.id}`} className="card p-3 flex gap-3 items-center hover:scale-[1.01] transition-all">
                      <div className="w-10 h-12 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center flex-shrink-0">
                        <ClipboardList size={16} className="text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold truncate">{q.title}</h4>
                        <span className="text-xs text-muted">{q.questionCount} سؤال • {q.duration} دقيقة</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <BottomNav active="search" />
    </div>
  );
}
