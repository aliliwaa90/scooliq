'use client';

import Link from 'next/link';
import { useCatalog } from '@/components/catalog-provider';
import { BottomNav } from '../page';
import { ArrowRight, ClipboardList, Clock, Users } from 'lucide-react';

export default function QuizzesPage() {
  const { quizzes, subjects } = useCatalog();

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 glass">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="w-9 h-9 rounded-full surface-elevated flex items-center justify-center">
            <ArrowRight size={18} />
          </Link>
          <h1 className="font-bold text-lg">الاختبارات الإلكترونية</h1>
          <span className="badge badge-accent mr-auto">{quizzes.length}</span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4">
        <p className="text-sm text-muted mb-4">اختبر معلوماتك واحصل على نتيجتك فوراً</p>

        <div className="space-y-3">
          {quizzes.map((quiz, i) => {
            const subj = subjects.find(s => s.id === quiz.subjectId);
            return (
              <Link key={quiz.id} href={`/quiz/${quiz.id}`} className="card p-4 hover:scale-[1.01] transition-all fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: subj ? `${subj.color}15` : '#FFF3CD' }}>
                    {subj?.icon || '📝'}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm">{quiz.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="badge badge-primary text-[10px]">{subj?.name}</span>
                      <span className="text-xs text-muted">{quiz.chapter}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted">
                      <span className="flex items-center gap-1"><ClipboardList size={12} />{quiz.questionCount} سؤال</span>
                      <span className="flex items-center gap-1"><Clock size={12} />{quiz.duration} دقيقة</span>
                      <span className="flex items-center gap-1"><Users size={12} />{quiz.attempts.toLocaleString('ar-EG')}</span>
                    </div>
                  </div>
                </div>
                <button className="btn-primary w-full mt-3 text-sm py-2.5">ابدأ الاختبار</button>
              </Link>
            );
          })}
        </div>
      </main>

      <BottomNav active="home" />
    </div>
  );
}
