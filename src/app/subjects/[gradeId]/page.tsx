'use client';

import Link from 'next/link';
import { useCatalog } from '@/components/catalog-provider';
import { useParams } from 'next/navigation';
import { BottomNav } from '../../page';
import { ChevronLeft, ArrowRight, Video, FileText, BookOpen, ClipboardList } from 'lucide-react';

export default function SubjectsPage() {
  const { subjects, grades } = useCatalog();
  const params = useParams();
  const gradeId = params.gradeId as string;
  const grade = grades.find(g => g.id === gradeId);
  const gradeSubjects = subjects.filter(s => s.gradeId === gradeId);

  if (!grade) {
    return <div className="min-h-screen flex items-center justify-center"><p>الصف غير موجود</p></div>;
  }

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 glass">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link href={`/stages`} className="w-9 h-9 rounded-full surface-elevated flex items-center justify-center">
            <ArrowRight size={18} />
          </Link>
          <div>
            <h1 className="font-bold text-lg">{grade.name}</h1>
            <p className="text-xs text-muted">المواد الدراسية</p>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4">
        {gradeSubjects.length === 0 ? (
          <div className="card p-8 text-center mt-8">
            <BookOpen size={48} className="mx-auto text-muted mb-4" />
            <h2 className="font-bold text-lg mb-2">قريباً</h2>
            <p className="text-sm text-muted">سيتم إضافة المواد الدراسية لهذا الصف قريباً</p>
          </div>
        ) : (
          <div className="space-y-3">
            {gradeSubjects.map((subj, i) => (
              <Link
                key={subj.id}
                href={`/subject/${subj.id}`}
                className="card p-4 flex items-center gap-4 hover:scale-[1.01] transition-all fade-in"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: `${subj.color}15` }}>
                  {subj.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-base">{subj.name}</h2>
                  <p className="text-xs text-muted mt-1 line-clamp-1">{subj.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-[11px] text-muted"><Video size={12} />{subj.videoCount}</span>
                    <span className="flex items-center gap-1 text-[11px] text-muted"><FileText size={12} />{subj.handoutCount}</span>
                    <span className="flex items-center gap-1 text-[11px] text-muted"><BookOpen size={12} />{subj.bookCount}</span>
                    <span className="flex items-center gap-1 text-[11px] text-muted"><ClipboardList size={12} />{subj.quizCount}</span>
                  </div>
                </div>
                <ChevronLeft size={18} className="text-muted flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </main>

      <BottomNav active="stages" />
    </div>
  );
}
