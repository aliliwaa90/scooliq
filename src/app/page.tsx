'use client';

import { useEffect } from 'react';
import { useCatalog } from '@/components/catalog-provider';
import Link from 'next/link';
import type { Handout as AppHandout, Video as AppVideo } from '@/lib/data';
import { useStore } from '@/lib/store';
import {
  Search, BookOpen, Video, FileText, ClipboardList, Star,
  Bell, User, ChevronLeft, TrendingUp, Clock, Download,
  Sun, Moon, GraduationCap, Sparkles, Eye, ArrowLeft
} from 'lucide-react';

export default function HomePage() {
  const { videos, handouts, quizzes, subjects, stages } = useCatalog();
  const { user, isDark, toggleTheme } = useStore();

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      useStore.getState().setDark(true);
    }
  }, []);

  const latestVideos = [...videos].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6);
  const popularVideos = [...videos].sort((a, b) => b.views - a.views).slice(0, 6);
  const latestHandouts = [...handouts].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6);
  const latestQuizzes = [...quizzes].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4);

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {user?.firstName?.charAt(0) || 'ط'}
            </div>
            <div>
              <p className="text-xs text-muted">مرحباً بك 👋</p>
              <p className="font-bold text-sm">{user?.firstName} {user?.lastName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="w-9 h-9 rounded-full surface-elevated flex items-center justify-center transition-all hover:scale-105">
              {isDark ? <Sun size={18} className="text-accent" /> : <Moon size={18} />}
            </button>
            <Link href="/notifications" className="w-9 h-9 rounded-full surface-elevated flex items-center justify-center relative transition-all hover:scale-105">
              <Bell size={18} />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-error rounded-full text-[10px] text-white flex items-center justify-center font-bold">2</span>
            </Link>
            <Link href="/profile" className="w-9 h-9 rounded-full surface-elevated flex items-center justify-center transition-all hover:scale-105">
              <User size={18} />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4">
        {/* Hero Banner */}
        <div className="mt-4 gradient-hero rounded-2xl p-5 text-white relative overflow-hidden fade-in">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-4 left-4 w-20 h-20 rounded-full bg-white/20"></div>
            <div className="absolute bottom-4 right-8 w-32 h-32 rounded-full bg-white/10"></div>
            <div className="absolute top-1/2 left-1/2 w-16 h-16 rounded-full bg-white/15"></div>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap size={24} />
              <span className="text-sm font-semibold opacity-90">حقيبة الطالب العراقي</span>
            </div>
            <h1 className="text-xl font-bold mb-1">تعلّم بذكاء، تميّز بعلم ✨</h1>
            <p className="text-sm opacity-80 mb-4">منصتك التعليمية الشاملة — فيديوهات، ملازم، كتب واختبارات</p>
            <Link href="/stages" className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-all rounded-xl px-4 py-2.5 text-sm font-semibold backdrop-blur-sm">
              <Sparkles size={16} />
              ابدأ التعلّم الآن
              <ChevronLeft size={16} />
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <Link href="/search" className="mt-4 flex items-center gap-3 card px-4 py-3.5 cursor-pointer fade-in" style={{ animationDelay: '0.1s' }}>
          <Search size={20} className="text-muted" />
          <span className="text-muted text-sm">ابحث عن فيديو، ملزمة، كتاب أو اختبار...</span>
        </Link>

        {/* Quick Access */}
        <div className="mt-5 fade-in" style={{ animationDelay: '0.15s' }}>
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: <Video size={22} />, label: 'فيديوهات', href: '/videos', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
              { icon: <FileText size={22} />, label: 'ملازم', href: '/handouts', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
              { icon: <BookOpen size={22} />, label: 'كتب', href: '/books', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
              { icon: <ClipboardList size={22} />, label: 'اختبارات', href: '/quizzes', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
            ].map((item, i) => (
              <Link key={i} href={item.href} className="card flex flex-col items-center gap-2 py-4 px-2 hover:scale-[1.03] transition-all">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: item.bg, color: item.color }}>
                  {item.icon}
                </div>
                <span className="text-xs font-semibold">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Study Stages */}
        <div className="mt-6 fade-in" style={{ animationDelay: '0.2s' }}>
          <SectionHeader title="المراحل الدراسية" href="/stages" />
          <div className="grid grid-cols-3 gap-3 mt-3">
            {stages.map((stage) => (
              <Link key={stage.id} href={`/grades/${stage.id}`} className="card p-4 text-center hover:scale-[1.03] transition-all">
                <div className="text-3xl mb-2">{stage.icon}</div>
                <p className="text-xs font-bold leading-tight">{stage.name}</p>
                <p className="text-[10px] text-muted mt-1">{stage.gradeCount} صفوف</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Latest Videos */}
        <div className="mt-6 fade-in" style={{ animationDelay: '0.25s' }}>
          <SectionHeader title="أحدث الفيديوهات" href="/videos" icon={<Video size={18} className="text-primary" />} />
          <div className="mt-3 flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollSnapType: 'x mandatory' }}>
            {latestVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                subjectName={subjects.find((s) => s.id === video.subjectId)?.name}
              />
            ))}
          </div>
        </div>

        {/* Popular Videos */}
        <div className="mt-6 fade-in" style={{ animationDelay: '0.3s' }}>
          <SectionHeader title="الأكثر مشاهدة" href="/videos" icon={<TrendingUp size={18} className="text-accent" />} />
          <div className="mt-3 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {popularVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                subjectName={subjects.find((s) => s.id === video.subjectId)?.name}
              />
            ))}
          </div>
        </div>

        {/* Latest Handouts */}
        <div className="mt-6 fade-in" style={{ animationDelay: '0.35s' }}>
          <SectionHeader title="أحدث الملازم والملخصات" href="/handouts" icon={<FileText size={18} className="text-success" />} />
          <div className="mt-3 space-y-2">
            {latestHandouts.slice(0, 4).map((h) => (
              <HandoutRow key={h.id} handout={h} />
            ))}
          </div>
        </div>

        {/* Latest Quizzes */}
        <div className="mt-6 fade-in" style={{ animationDelay: '0.4s' }}>
          <SectionHeader title="اختبارات جديدة" href="/quizzes" icon={<ClipboardList size={18} className="text-accent" />} />
          <div className="mt-3 grid grid-cols-2 gap-3">
            {latestQuizzes.map((quiz) => {
              const subj = subjects.find(s => s.id === quiz.subjectId);
              return (
                <Link key={quiz.id} href={`/quiz/${quiz.id}`} className="card p-4 hover:scale-[1.02] transition-all">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-3" style={{ background: subj ? `${subj.color}15` : '#f0f0f0' }}>
                    {subj?.icon || '📝'}
                  </div>
                  <h3 className="text-sm font-bold mb-1 line-clamp-2">{quiz.title}</h3>
                  <p className="text-xs text-muted">{quiz.questionCount} سؤال • {quiz.duration} دقيقة</p>
                  <div className="mt-2 flex items-center gap-1 text-xs text-muted">
                    <ClipboardList size={12} />
                    <span>{quiz.attempts.toLocaleString('ar-EG')} محاولة</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Subjects for user's grade */}
        <div className="mt-6 mb-8 fade-in" style={{ animationDelay: '0.45s' }}>
          <SectionHeader title="المواد الدراسية - الثالث المتوسط" href="/subjects/g9" icon={<BookOpen size={18} className="text-primary" />} />
          <div className="mt-3 grid grid-cols-3 gap-3">
            {subjects.filter(s => s.gradeId === 'g9').map((subj) => (
              <Link key={subj.id} href={`/subject/${subj.id}`} className="card p-3 text-center hover:scale-[1.03] transition-all">
                <div className="text-2xl mb-1.5">{subj.icon}</div>
                <p className="text-xs font-bold">{subj.name}</p>
                <p className="text-[10px] text-muted mt-0.5">{subj.videoCount} فيديو</p>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav active="home" />
    </div>
  );
}

// ===== COMPONENTS =====

function SectionHeader({ title, href, icon }: { title: string; href: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="font-bold text-base">{title}</h2>
      </div>
      <Link href={href} className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline">
        عرض الكل
        <ChevronLeft size={14} />
      </Link>
    </div>
  );
}

function VideoCard({ video, subjectName }: { video: AppVideo; subjectName?: string }) {
  return (
    <Link href={`/video/${video.id}`} className="card min-w-[220px] overflow-hidden flex-shrink-0 hover:scale-[1.02] transition-all" style={{ scrollSnapAlign: 'start' }}>
      <div className="h-28 bg-gradient-to-br from-primary/20 to-primary-light/20 flex items-center justify-center relative">
        <Video size={32} className="text-primary/50" />
        <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-md font-semibold">{video.duration}</span>
        {!video.isFree && (
          <span className="absolute top-2 right-2 bg-accent text-white text-[10px] px-2 py-0.5 rounded-md font-bold">مميز</span>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-bold line-clamp-2 mb-1">{video.title}</h3>
        <p className="text-xs text-muted">{video.teacher}</p>
        <div className="flex items-center gap-3 mt-2 text-xs text-muted">
          <span className="flex items-center gap-1"><Eye size={12} />{video.views.toLocaleString('ar-EG')}</span>
          <span className="badge-primary badge text-[10px]">{subjectName}</span>
        </div>
      </div>
    </Link>
  );
}

function HandoutRow({ handout }: { handout: AppHandout }) {
  const typeLabels: Record<string, string> = { handout: 'ملزمة', book: 'كتاب', summary: 'ملخص' };
  return (
    <Link href={`/handouts`} className="card p-3 flex items-center gap-3 hover:scale-[1.01] transition-all">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-success/20 to-success/10 flex items-center justify-center flex-shrink-0">
        <FileText size={22} className="text-success" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold truncate">{handout.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="badge badge-primary text-[10px]">{typeLabels[handout.type]}</span>
          <span className="text-xs text-muted">{handout.fileSize}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 text-xs text-muted">
        <Download size={12} />
        <span>{handout.downloads.toLocaleString('ar-EG')}</span>
      </div>
    </Link>
  );
}

export function BottomNav({ active }: { active: string }) {
  const items = [
    { id: 'home', icon: <GraduationCap size={22} />, label: 'الرئيسية', href: '/' },
    { id: 'stages', icon: <BookOpen size={22} />, label: 'المراحل', href: '/stages' },
    { id: 'search', icon: <Search size={22} />, label: 'البحث', href: '/search' },
    { id: 'favorites', icon: <Star size={22} />, label: 'المفضلة', href: '/favorites' },
    { id: 'profile', icon: <User size={22} />, label: 'حسابي', href: '/profile' },
  ];

  return (
    <nav className="bottom-nav glass border-t border-theme">
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all ${
              active === item.id
                ? 'text-primary font-bold'
                : 'text-muted hover:text-primary/70'
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-semibold">{item.label}</span>
            {active === item.id && (
              <div className="w-5 h-1 rounded-full bg-primary mt-0.5"></div>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
