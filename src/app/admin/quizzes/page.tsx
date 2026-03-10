'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useCatalog } from '@/components/catalog-provider';
import { AdminShell } from '@/components/admin/admin-shell';
import { ClipboardList, Eye, EyeOff, Plus, Save, Trash2, X } from 'lucide-react';
import type { Question } from '@/lib/data';

const exampleQuestions = JSON.stringify(
  [
    {
      text: 'ما ناتج 2 + 2؟',
      type: 'mcq',
      options: ['3', '4', '5', '6'],
      correct: 1,
      explanation: 'الإجابة الصحيحة هي 4.',
    },
    {
      text: 'المعادلة الخطية درجتها الأولى.',
      type: 'truefalse',
      options: ['صح', 'خطأ'],
      correct: 0,
      explanation: 'لأن أعلى أس للمتغير هو 1.',
    },
  ],
  null,
  2,
);

const initialForm = {
  title: '',
  subjectId: '',
  chapter: '',
  duration: '15',
  isActive: true,
  questionsJson: exampleQuestions,
};

function parseQuestions(value: string) {
  const parsed = JSON.parse(value) as Question[];

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('يجب إدخال مصفوفة أسئلة صحيحة.');
  }

  return parsed;
}

export default function AdminQuizzesPage() {
  const router = useRouter();
  const { quizzes, subjects } = useCatalog();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isPending, startTransition] = useTransition();

  function updateField<Key extends keyof typeof form>(key: Key, value: (typeof form)[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');

    let questions: Question[];

    try {
      questions = parseQuestions(form.questionsJson);
    } catch {
      setError('تنسيق JSON الخاص بالأسئلة غير صحيح.');
      return;
    }

    const response = await fetch('/api/admin/quizzes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...form,
        duration: Number(form.duration),
        questions,
      }),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      setError(payload?.message ?? 'تعذر حفظ الاختبار.');
      return;
    }

    setForm(initialForm);
    setShowForm(false);
    setSuccess('تم حفظ الاختبار وربطه بالمنصة.');
    startTransition(() => {
      router.refresh();
    });
  }

  async function runAction(id: string, action: 'toggle-active' | 'delete') {
    setError('');
    setSuccess('');

    if (action === 'delete' && !window.confirm('سيتم حذف الاختبار نهائياً. هل تريد المتابعة؟')) {
      return;
    }

    const response = await fetch(`/api/admin/quizzes/${id}`, {
      method: action === 'delete' ? 'DELETE' : 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: action === 'delete' ? undefined : JSON.stringify({ action }),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      setError(payload?.message ?? 'تعذر تنفيذ الإجراء.');
      return;
    }

    setSuccess(action === 'delete' ? 'تم حذف الاختبار.' : 'تم تحديث حالة الاختبار.');
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <AdminShell
      active="quizzes"
      title="إدارة الاختبارات"
      subtitle={`${quizzes.length} اختبار محفوظ حالياً في قاعدة البيانات.`}
      actions={
        <button type="button" onClick={() => setShowForm((value) => !value)} className="btn-primary text-sm">
          <Plus size={16} />
          {showForm ? 'إغلاق النموذج' : 'إضافة اختبار'}
        </button>
      }
    >
      {error ? <div className="mb-4 rounded-2xl border border-error/20 bg-error/10 px-4 py-3 text-sm text-error">{error}</div> : null}
      {success ? <div className="mb-4 rounded-2xl border border-success/20 bg-success/10 px-4 py-3 text-sm text-success">{success}</div> : null}

      {showForm ? (
        <form onSubmit={handleCreate} className="card mb-6 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">اختبار جديد</h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-muted">
              <X size={18} />
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <input className="input-field text-sm" placeholder="عنوان الاختبار" value={form.title} onChange={(event) => updateField('title', event.target.value)} />
            <select className="input-field text-sm" value={form.subjectId} onChange={(event) => updateField('subjectId', event.target.value)}>
              <option value="">اختر المادة</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
            <input className="input-field text-sm" placeholder="الفصل أو الوحدة" value={form.chapter} onChange={(event) => updateField('chapter', event.target.value)} />
            <input className="input-field text-sm" type="number" min={1} placeholder="المدة بالدقائق" value={form.duration} onChange={(event) => updateField('duration', event.target.value)} />
          </div>

          <label className="mt-4 block text-xs font-bold text-muted">الأسئلة بصيغة JSON</label>
          <textarea
            className="input-field mt-1 min-h-[260px] resize-y text-sm"
            value={form.questionsJson}
            onChange={(event) => updateField('questionsJson', event.target.value)}
            dir="ltr"
          />

          <label className="mt-3 flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={form.isActive} onChange={(event) => updateField('isActive', event.target.checked)} className="h-4 w-4 accent-primary" />
            ظاهر في المنصة
          </label>

          <button type="submit" disabled={isPending} className="btn-primary mt-4 text-sm">
            <Save size={15} />
            {isPending ? 'جار الحفظ...' : 'حفظ الاختبار'}
          </button>
        </form>
      ) : null}

      <div className="grid gap-3">
        {quizzes.map((quiz) => {
          const subject = subjects.find((item) => item.id === quiz.subjectId);
          return (
            <div key={quiz.id} className="card p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <ClipboardList size={22} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <h3 className="font-bold">{quiz.title}</h3>
                    <span className="badge badge-primary text-[10px]">{subject?.name ?? 'بدون مادة'}</span>
                    <span className={`badge text-[10px] ${quiz.isActive ? 'badge-success' : 'badge-primary'}`}>
                      {quiz.isActive ? 'ظاهر' : 'مخفي'}
                    </span>
                  </div>
                  <p className="text-sm text-muted">{quiz.chapter}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted">
                    <span>{quiz.questionCount} سؤال</span>
                    <span>{quiz.duration} دقيقة</span>
                    <span>{quiz.attempts.toLocaleString('ar-EG')} محاولة</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => runAction(quiz.id, 'toggle-active')}
                    className="flex h-8 w-8 items-center justify-center rounded-xl surface-elevated transition-all hover:text-primary"
                  >
                    {quiz.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => runAction(quiz.id, 'delete')}
                    className="flex h-8 w-8 items-center justify-center rounded-xl surface-elevated transition-all hover:text-error"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AdminShell>
  );
}
