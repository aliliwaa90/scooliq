'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useCatalog } from '@/components/catalog-provider';
import { AdminShell } from '@/components/admin/admin-shell';
import {
  Download,
  Eye,
  EyeOff,
  FileText,
  Plus,
  Save,
  Search,
  Trash2,
  X,
} from 'lucide-react';

const initialForm = {
  title: '',
  fileUrl: '',
  fileSize: '',
  cover: '',
  subjectId: '',
  type: 'handout',
  isFree: true,
  isActive: true,
};

const typeLabels: Record<string, string> = {
  handout: 'ملزمة',
  book: 'كتاب',
  summary: 'ملخص',
};

export default function AdminHandoutsPage() {
  const router = useRouter();
  const { handouts, subjects } = useCatalog();
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isPending, startTransition] = useTransition();

  const filteredHandouts = useMemo(
    () =>
      handouts.filter((handout) =>
        [handout.title, handout.fileSize, typeLabels[handout.type]]
          .join(' ')
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      ),
    [handouts, searchQuery],
  );

  function updateField<Key extends keyof typeof form>(key: Key, value: (typeof form)[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');

    const response = await fetch('/api/admin/handouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      setError(payload?.message ?? 'تعذر حفظ الملف.');
      return;
    }

    setForm(initialForm);
    setShowForm(false);
    setSuccess('تم حفظ الملف في قاعدة البيانات.');
    startTransition(() => {
      router.refresh();
    });
  }

  async function runAction(id: string, action: 'toggle-active' | 'delete') {
    setError('');
    setSuccess('');

    if (action === 'delete' && !window.confirm('سيتم حذف الملف نهائياً. هل تريد المتابعة؟')) {
      return;
    }

    const response = await fetch(`/api/admin/handouts/${id}`, {
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

    setSuccess(action === 'delete' ? 'تم حذف الملف.' : 'تم تحديث حالة الملف.');
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <AdminShell
      active="handouts"
      title="إدارة الملفات والكتب"
      subtitle={`${handouts.length} ملف مرتبط فعلياً بقاعدة البيانات.`}
      actions={
        <button type="button" onClick={() => setShowForm((value) => !value)} className="btn-primary text-sm">
          <Plus size={16} />
          {showForm ? 'إغلاق النموذج' : 'إضافة ملف'}
        </button>
      }
    >
      {error ? <div className="mb-4 rounded-2xl border border-error/20 bg-error/10 px-4 py-3 text-sm text-error">{error}</div> : null}
      {success ? <div className="mb-4 rounded-2xl border border-success/20 bg-success/10 px-4 py-3 text-sm text-success">{success}</div> : null}

      {showForm ? (
        <form onSubmit={handleCreate} className="card mb-6 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">ملف جديد</h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-muted">
              <X size={18} />
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <input className="input-field text-sm" placeholder="عنوان الملف" value={form.title} onChange={(event) => updateField('title', event.target.value)} />
            <select className="input-field text-sm" value={form.type} onChange={(event) => updateField('type', event.target.value)}>
              <option value="handout">ملزمة</option>
              <option value="book">كتاب</option>
              <option value="summary">ملخص</option>
            </select>
            <select className="input-field text-sm" value={form.subjectId} onChange={(event) => updateField('subjectId', event.target.value)}>
              <option value="">اختر المادة</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
            <input className="input-field text-sm" placeholder="حجم الملف مثال 2.4 MB" value={form.fileSize} onChange={(event) => updateField('fileSize', event.target.value)} />
            <input className="input-field text-sm" placeholder="رابط الملف PDF" value={form.fileUrl} onChange={(event) => updateField('fileUrl', event.target.value)} dir="ltr" />
            <input className="input-field text-sm" placeholder="رابط صورة الغلاف" value={form.cover} onChange={(event) => updateField('cover', event.target.value)} dir="ltr" />
          </div>

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
            {isPending ? 'جار الحفظ...' : 'حفظ الملف'}
          </button>
        </form>
      ) : null}

      <div className="relative mb-4">
        <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          className="input-field pr-9 text-sm"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="ابحث عن ملف أو نوع أو حجم..."
        />
      </div>

      <div className="grid gap-3">
        {filteredHandouts.map((handout) => {
          const subject = subjects.find((item) => item.id === handout.subjectId);
          return (
            <div key={handout.id} className="card p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-success/10 text-success">
                  <FileText size={22} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <h3 className="font-bold">{handout.title}</h3>
                    <span className="badge badge-primary text-[10px]">{typeLabels[handout.type]}</span>
                    <span className={`badge text-[10px] ${handout.isActive ? 'badge-success' : 'badge-primary'}`}>
                      {handout.isActive ? 'ظاهر' : 'مخفي'}
                    </span>
                  </div>
                  <p className="text-sm text-muted">{subject?.name ?? 'بدون مادة'} • {handout.fileSize}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <Download size={12} />
                      {handout.downloads.toLocaleString('ar-EG')}
                    </span>
                    <span>{handout.createdAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => runAction(handout.id, 'toggle-active')}
                    className="flex h-8 w-8 items-center justify-center rounded-xl surface-elevated transition-all hover:text-primary"
                  >
                    {handout.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => runAction(handout.id, 'delete')}
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
