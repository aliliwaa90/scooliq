'use client';

import { useState } from 'react';
import { useCatalog } from '@/components/catalog-provider';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { BottomNav } from '../../page';
import { ArrowRight, Video, FileText, BookOpen, ClipboardList, Eye, Download, Clock, ChevronLeft, Star } from 'lucide-react';
import { useStore } from '@/lib/store';

const tabs = [
  { id: 'videos', label: 'فيديوهات', icon: <Video size={16} /> },
  { id: 'handouts', label: 'ملازم', icon: <FileText size={16} /> },
  { id: 'books', label: 'كتب', icon: <BookOpen size={16} /> },
  { id: 'quizzes', label: 'اختبارات', icon: <ClipboardList size={16} /> },
];

export default function SubjectPage() {
  const { subjects, videos, handouts, quizzes, grades } = useCatalog();
  const params = useParams();
  const subjectId = params.id as string;
  const subject = subjects.find(s => s.id === subjectId);
  const [activeTab, setActiveTab] = useState('videos');
  const { favorites, addFavorite, removeFavorite } = useStore();

  if (!subject) {
    return <div className="min-h-screen flex items-center justify-center"><p>المادة غير موجودة</p></div>;
  }

  const grade = grades.find(g => g.id === subject.gradeId);
  const subjectVideos = videos.filter(v => v.subjectId === subjectId);
  const subjectHandouts = handouts.filter(h => h.subjectId === subjectId && h.type === 'handout');
  const subjectBooks = handouts.filter(h => h.subjectId === subjectId && h.type === 'book');
  const subjectQuizzes = quizzes.filter(q => q.subjectId === subjectId);

  return (
    <div className="min-h-screen pb-24">
      {/* Header with gradient */}
      <div className="relative">
        <div className="h-44 rounded-b-3xl flex items-end" style={{ background: `linear-gradient(135deg, ${subject.color}, ${subject.color}99)` }}>
          <div className="absolute top-0 left-0 right-0 px-4 py-3 flex items-center gap-3">
            <Link href={`/subjects/${subject.gradeId}`} className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
              <ArrowRight size={18} />
            </Link>
          </div>
          <div className="px-5 pb-5 text-white w-full">
            <div className="text-4xl mb-2">{subject.icon}</div>
            <h1 className="text-2xl font-bold">{subject.name}</h1>
            <p className="text-sm opacity-80 mt-1">{grade?.name} • {subject.description}</p>
          </div>
          <div className="absolute top-6 left-6 w-24 h-24 rounded-full bg-white/10"></div>
          <div className="absolute top-16 left-20 w-12 h-12 rounded-full bg-white/5"></div>
        </div>

        {/* Stats */}
        <div className="mx-4 -mt-4 relative z-10">
          <div className="card p-3 grid grid-cols-4 gap-2 text-center">
            <div>
              <p className="font-bold text-primary text-lg">{subject.videoCount}</p>
              <p className="text-[10px] text-muted">فيديو</p>
            </div>
            <div>
              <p className="font-bold text-success text-lg">{subject.handoutCount}</p>
              <p className="text-[10px] text-muted">ملزمة</p>
            </div>
            <div>
              <p className="font-bold text-purple-500 text-lg">{subject.bookCount}</p>
              <p className="text-[10px] text-muted">كتاب</p>
            </div>
            <div>
              <p className="font-bold text-accent text-lg">{subject.quizCount}</p>
              <p className="text-[10px] text-muted">اختبار</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-lg mx-auto px-4 mt-4">
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-lg'
                  : 'surface-elevated text-muted hover:text-primary'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-4 space-y-3 fade-in">
          {activeTab === 'videos' && (
            subjectVideos.length > 0 ? subjectVideos.map(video => (
              <Link key={video.id} href={`/video/${video.id}`} className="card p-3 flex gap-3 items-center hover:scale-[1.01] transition-all">
                <div className="w-24 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary-light/20 flex items-center justify-center flex-shrink-0 relative">
                  <Video size={20} className="text-primary/50" />
                  <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded">{video.duration}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold line-clamp-2">{video.title}</h3>
                  <p className="text-xs text-muted mt-1">{video.teacher}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-muted">
                    <span className="flex items-center gap-1"><Eye size={11} />{video.views.toLocaleString('ar-EG')}</span>
                    <span className="flex items-center gap-1"><Clock size={11} />{video.chapter}</span>
                  </div>
                </div>
              </Link>
            )) : <EmptyState text="لا توجد فيديوهات حالياً" />
          )}

          {activeTab === 'handouts' && (
            subjectHandouts.length > 0 ? subjectHandouts.map(h => (
              <div key={h.id} className="card p-3 flex gap-3 items-center">
                <div className="w-12 h-14 rounded-xl bg-gradient-to-br from-success/20 to-success/10 flex items-center justify-center flex-shrink-0">
                  <FileText size={20} className="text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold truncate">{h.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted">{h.fileSize}</span>
                    <span className="flex items-center gap-1 text-xs text-muted"><Download size={11} />{h.downloads.toLocaleString('ar-EG')}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => favorites.includes(h.id) ? removeFavorite(h.id) : addFavorite(h.id)}
                    className="w-9 h-9 rounded-full surface-elevated flex items-center justify-center"
                  >
                    <Star size={16} className={favorites.includes(h.id) ? 'fill-accent text-accent' : 'text-muted'} />
                  </button>
                  <button className="btn-primary text-xs px-3 py-1.5">تحميل</button>
                </div>
              </div>
            )) : <EmptyState text="لا توجد ملازم حالياً" />
          )}

          {activeTab === 'books' && (
            subjectBooks.length > 0 ? subjectBooks.map(b => (
              <div key={b.id} className="card p-3 flex gap-3 items-center">
                <div className="w-12 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <BookOpen size={20} className="text-purple-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold truncate">{b.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted">{b.fileSize}</span>
                    <span className="badge badge-primary text-[10px]">كتاب</span>
                  </div>
                </div>
                <button className="btn-primary text-xs px-3 py-1.5">عرض</button>
              </div>
            )) : <EmptyState text="لا توجد كتب حالياً" />
          )}

          {activeTab === 'quizzes' && (
            subjectQuizzes.length > 0 ? subjectQuizzes.map(quiz => (
              <Link key={quiz.id} href={`/quiz/${quiz.id}`} className="card p-4 hover:scale-[1.01] transition-all">
                <h3 className="font-bold text-sm">{quiz.title}</h3>
                <p className="text-xs text-muted mt-1">{quiz.chapter}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted">
                  <span>{quiz.questionCount} سؤال</span>
                  <span>{quiz.duration} دقيقة</span>
                  <span>{quiz.attempts.toLocaleString('ar-EG')} محاولة</span>
                </div>
                <button className="btn-primary text-xs px-4 py-2 mt-3 w-full">ابدأ الاختبار</button>
              </Link>
            )) : <EmptyState text="لا توجد اختبارات حالياً" />
          )}
        </div>
      </main>

      <BottomNav active="stages" />
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="card p-8 text-center">
      <BookOpen size={40} className="mx-auto text-muted mb-3" />
      <p className="text-sm text-muted">{text}</p>
    </div>
  );
}
