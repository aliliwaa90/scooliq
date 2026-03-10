'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useCatalog } from '@/components/catalog-provider';
import { AdminShell } from '@/components/admin/admin-shell';
import {
  Eye,
  EyeOff,
  Plus,
  Save,
  Search,
  Trash2,
  Video,
  X,
} from 'lucide-react';

const initialForm = {
  title: '',
  url: '',
  teacher: '',
  duration: '',
  subjectId: '',
  chapter: '',
  lesson: '',
  description: '',
  thumbnail: '',
  isFree: true,
  isActive: true,
};

export default function AdminVideosPage() {
  const router = useRouter();
  const { videos, subjects, grades } = useCatalog();
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState(initialForm);
  const [isPending, startTransition] = useTransition();

  const filteredVideos = useMemo(
    () =>
      videos.filter((video) =>
        [video.title, video.teacher, video.chapter, video.lesson]
          .join(' ')
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      ),
    [searchQuery, videos],
  );

  function updateField<Key extends keyof typeof form>(key: Key, value: (typeof form)[Key]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');

    const response = await fetch('/api/admin/videos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      setError(payload?.message ?? 'تعذر حفظ الفيديو.');
      return;
    }

    setForm(initialForm);
    setShowForm(false);
    setSuccess('تم حفظ الفيديو وربطه بقاعدة البيانات.');
    startTransition(() => {
      router.refresh();
    });
  }

  async function runAction(id: string, action: 'toggle-active' | 'delete') {
    setError('');
    setSuccess('');

    if (action === 'delete' && !window.confirm('سيتم حذف الفيديو نهائياً. هل تريد المتابعة؟')) {
      return;
    }

    const response = await fetch(`/api/admin/videos/${id}`, {
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

    setSuccess(action === 'delete' ? 'تم حذف الفيديو.' : 'تم تحديث حالة الفيديو.');
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <AdminShell
      active="videos"
      title="إدارة الفيديوهات"
      subtitle={`${videos.length} فيديو محفوظ فعلياً في قاعدة البيانات.`}
      actions={
        <button type="button" onClick={() => setShowForm((value) => !value)} className="btn-primary text-sm">
          <Plus size={16} />
          {showForm ? 'إغلاق النموذج' : 'إضافة فيديو'}
        </button>
      }
    >
      {error ? <div className="mb-4 rounded-2xl border border-error/20 bg-error/10 px-4 py-3 text-sm text-error">{error}</div> : null}
      {success ? <div className="mb-4 rounded-2xl border border-success/20 bg-success/10 px-4 py-3 text-sm text-success">{success}</div> : null}

      {showForm ? (
        <form onSubmit={handleCreate} className="card mb-6 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">فيديو جديد</h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-muted">
              <X size={18} />
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <input className="input-field text-sm" placeholder="عنوان الفيديو" value={form.title} onChange={(event) => updateField('title', event.target.value)} />
            <input className="input-field text-sm" placeholder="رابط الفيديو" value={form.url} onChange={(event) => updateField('url', event.target.value)} dir="ltr" />
            <input className="input-field text-sm" placeholder="اسم المدرس" value={form.teacher} onChange={(event) => updateField('teacher', event.target.value)} />
            <input className="input-field text-sm" placeholder="المدة مثال 25:30" value={form.duration} onChange={(event) => updateField('duration', event.target.value)} />
            <select className="input-field text-sm" value={form.subjectId} onChange={(event) => updateField('subjectId', event.target.value)}>
              <option value="">اختر المادة</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name} - {grades.find((grade) => grade.id === subject.gradeId)?.name}
                </option>
              ))}
            </select>
            <input className="input-field text-sm" placeholder="الفصل أو الوحدة" value={form.chapter} onChange={(event) => updateField('chapter', event.target.value)} />
            <input className="input-field text-sm" placeholder="الدرس" value={form.lesson} onChange={(event) => updateField('lesson', event.target.value)} />
            <input className="input-field text-sm" placeholder="رابط الصورة المصغرة" value={form.thumbnail} onChange={(event) => updateField('thumbnail', event.target.value)} dir="ltr" />
          </div>

          <textarea className="input-field mt-3 min-h-[90px] resize-none text-sm" placeholder="وصف الفيديو" value={form.description} onChange={(event) => updateField('description', event.target.value)} />

          <div className="mt-3 flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" checked={form.isFree} onChange={(event) => updateField('isFree', event.target.checked)} className="h-4 w-4 accent-primary" />
              مجاني
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" checked={form.isActive} onChange={(event) => updateField('isActive', event.target.checked)} className="h-4 w-4 accent-primary" />
              ظاهر في المنصة
            </label>
          </div>

          <button type="submit" disabled={isPending} className="btn-primary mt-4 text-sm">
            <Save size={15} />
            {isPending ? 'جار الحفظ...' : 'حفظ الفيديو'}
          </button>
        </form>
      ) : null}

      <div className="relative mb-4">
        <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          className="input-field pr-9 text-sm"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="ابحث عن فيديو أو مدرس أو فصل..."
        />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="surface-elevated text-right">
                <th className="p-3 text-muted">الفيديو</th>
                <th className="p-3 text-muted hidden md:table-cell">المادة</th>
                <th className="p-3 text-muted hidden md:table-cell">المدرس</th>
                <th className="p-3 text-muted hidden md:table-cell">المشاهدات</th>
                <th className="p-3 text-muted">الحالة</th>
                <th className="p-3 text-muted">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredVideos.map((video) => {
                const subject = subjects.find((item) => item.id === video.subjectId);
                return (
                  <tr key={video.id} className="border-t border-theme">
                    <td className="p-3">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <Video size={18} />
                        </div>
                        <div>
                          <p className="font-bold">{video.title}</p>
                          <p className="text-xs text-muted">{video.chapter} - {video.lesson}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 hidden md:table-cell">
                      <span className="badge badge-primary text-[10px]">{subject?.name ?? 'غير معروف'}</span>
                    </td>
                    <td className="p-3 hidden md:table-cell text-muted">{video.teacher}</td>
                    <td className="p-3 hidden md:table-cell text-muted">{video.views.toLocaleString('ar-EG')}</td>
                    <td className="p-3">
                      <span className={`badge text-[10px] ${video.isActive ? 'badge-success' : 'badge-primary'}`}>
                        {video.isActive ? 'ظاهر' : 'مخفي'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => runAction(video.id, 'toggle-active')}
                          className="flex h-8 w-8 items-center justify-center rounded-xl surface-elevated transition-all hover:text-primary"
                          title={video.isActive ? 'إخفاء' : 'إظهار'}
                        >
                          {video.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button
                          type="button"
                          onClick={() => runAction(video.id, 'delete')}
                          className="flex h-8 w-8 items-center justify-center rounded-xl surface-elevated transition-all hover:text-error"
                          title="حذف"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
