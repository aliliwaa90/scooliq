'use client';

import Link from 'next/link';
import { useCatalog } from '@/components/catalog-provider';
import { BottomNav } from '../page';
import { ChevronLeft, ArrowRight, GraduationCap } from 'lucide-react';

export default function StagesPage() {
  const { stages } = useCatalog();

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 glass">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="w-9 h-9 rounded-full surface-elevated flex items-center justify-center">
            <ArrowRight size={18} />
          </Link>
          <h1 className="font-bold text-lg">المراحل الدراسية</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4">
        <p className="text-sm text-muted mb-6">اختر المرحلة الدراسية للوصول إلى المحتوى التعليمي</p>

        <div className="space-y-4">
          {stages.map((stage, i) => (
            <Link
              key={stage.id}
              href={`/grades/${stage.id}`}
              className="card p-5 flex items-center gap-4 hover:scale-[1.02] transition-all fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ background: `${stage.color}15` }}>
                {stage.icon}
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-lg">{stage.name}</h2>
                <p className="text-sm text-muted mt-1">{stage.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="badge badge-primary">{stage.gradeCount} صفوف</span>
                </div>
              </div>
              <ChevronLeft size={20} className="text-muted" />
            </Link>
          ))}
        </div>

        <div className="mt-8 card p-5 text-center">
          <GraduationCap size={40} className="mx-auto text-primary mb-3" />
          <h3 className="font-bold text-lg mb-2">حقيبة الطالب العراقي</h3>
          <p className="text-sm text-muted">كل ما يحتاجه الطالب العراقي في مكان واحد — فيديوهات، ملازم، كتب واختبارات تفاعلية</p>
        </div>
      </main>

      <BottomNav active="stages" />
    </div>
  );
}
