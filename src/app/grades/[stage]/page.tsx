'use client';

import Link from 'next/link';
import { useCatalog } from '@/components/catalog-provider';
import { useParams } from 'next/navigation';
import { BottomNav } from '../../page';
import { ChevronLeft, ArrowRight } from 'lucide-react';

export default function GradesPage() {
  const { grades, stages, stageToGradeMap } = useCatalog();
  const params = useParams();
  const stageId = params.stage as string;
  const stage = stages.find(s => s.id === stageId);
  const stageArabic = stageToGradeMap[stageId] || '';
  const stageGrades = grades.filter(g => g.stage === stageArabic);

  if (!stage) {
    return <div className="min-h-screen flex items-center justify-center"><p>المرحلة غير موجودة</p></div>;
  }

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 glass">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/stages" className="w-9 h-9 rounded-full surface-elevated flex items-center justify-center">
            <ArrowRight size={18} />
          </Link>
          <div>
            <h1 className="font-bold text-lg">{stage.name}</h1>
            <p className="text-xs text-muted">اختر الصف الدراسي</p>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          {stageGrades.map((grade, i) => (
            <Link
              key={grade.id}
              href={`/subjects/${grade.id}`}
              className="card p-5 text-center hover:scale-[1.03] transition-all fade-in"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-2xl mb-3" style={{ background: `${stage.color}15` }}>
                {stage.icon}
              </div>
              <h2 className="font-bold text-sm">{grade.name}</h2>
              <div className="flex items-center justify-center gap-1 mt-2 text-xs text-primary font-semibold">
                <span>عرض المواد</span>
                <ChevronLeft size={14} />
              </div>
            </Link>
          ))}
        </div>
      </main>

      <BottomNav active="stages" />
    </div>
  );
}
