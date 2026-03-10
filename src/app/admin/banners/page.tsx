'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useCatalog } from '@/components/catalog-provider';
import { AdminShell } from '@/components/admin/admin-shell';
import { Eye, EyeOff, Image as ImageIcon, Plus, Save, Trash2, X } from 'lucide-react';

const initialForm = {
  title: '',
  subtitle: '',
  imageUrl: '',
  linkUrl: '',
  sortOrder: '0',
  isActive: true,
};

export default function AdminBannersPage() {
  const router = useRouter();
  const { banners } = useCatalog();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isPending, startTransition] = useTransition();

  function updateField<Key extends keyof typeof form>(key: Key, value: (typeof form)[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');

    const response = await fetch('/api/admin/banners', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...form,
        sortOrder: Number(form.sortOrder),
      }),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      setError(payload?.message ?? 'تعذر حفظ البانر.');
      return;
    }

    setForm(initialForm);
    setShowForm(false);
    setSuccess('تم حفظ البانر وسيظهر في الصفحة الرئيسية عند تفعيله.');
    startTransition(() => {
      router.refresh();
    });
  }

  async function runAction(id: string, action: 'toggle-active' | 'delete') {
    setError('');
    setSuccess('');

    if (action === 'delete' && !window.confirm('سيتم حذف البانر نهائياً. هل تريد المتابعة؟')) {
      return;
    }

    const response = await fetch(`/api/admin/banners/${id}`, {
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

    setSuccess(action === 'delete' ? 'تم حذف البانر.' : 'تم تحديث حالة البانر.');
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <AdminShell
      active="banners"
      title="إدارة البانرات"
      subtitle="البانرات النشطة هنا تظهر في الصفحة الرئيسية مباشرة."
      actions={
        <button type="button" onClick={() => setShowForm((value) => !value)} className="btn-primary text-sm">
          <Plus size={16} />
          {showForm ? 'إغلاق النموذج' : 'إضافة بانر'}
        </button>
      }
    >
      {error ? <div className="mb-4 rounded-2xl border border-error/20 bg-error/10 px-4 py-3 text-sm text-error">{error}</div> : null}
      {success ? <div className="mb-4 rounded-2xl border border-success/20 bg-success/10 px-4 py-3 text-sm text-success">{success}</div> : null}

      {showForm ? (
        <form onSubmit={handleSubmit} className="card mb-6 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">بانر جديد</h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-muted">
              <X size={18} />
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <input className="input-field text-sm" placeholder="عنوان البانر" value={form.title} onChange={(event) => updateField('title', event.target.value)} />
            <input className="input-field text-sm" placeholder="ترتيب الظهور" type="number" value={form.sortOrder} onChange={(event) => updateField('sortOrder', event.target.value)} />
            <input className="input-field text-sm" placeholder="الوصف المختصر" value={form.subtitle} onChange={(event) => updateField('subtitle', event.target.value)} />
            <input className="input-field text-sm" placeholder="الرابط عند الضغط" value={form.linkUrl} onChange={(event) => updateField('linkUrl', event.target.value)} dir="ltr" />
            <input className="input-field text-sm md:col-span-2" placeholder="رابط الصورة إن وجد" value={form.imageUrl} onChange={(event) => updateField('imageUrl', event.target.value)} dir="ltr" />
          </div>

          <label className="mt-3 flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={form.isActive} onChange={(event) => updateField('isActive', event.target.checked)} className="h-4 w-4 accent-primary" />
            بانر نشط
          </label>

          <button type="submit" disabled={isPending} className="btn-primary mt-4 text-sm">
            <Save size={15} />
            {isPending ? 'جار الحفظ...' : 'حفظ البانر'}
          </button>
        </form>
      ) : null}

      <div className="grid gap-3">
        {banners.map((banner) => (
          <div key={banner.id} className="card p-4">
            <div className="flex flex-wrap items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <ImageIcon size={22} />
                </div>

              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <h3 className="font-bold">{banner.title}</h3>
                  <span className={`badge text-[10px] ${banner.isActive ? 'badge-success' : 'badge-primary'}`}>
                    {banner.isActive ? 'نشط' : 'مخفي'}
                  </span>
                </div>
                <p className="text-sm text-muted">{banner.subtitle}</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted">
                  <span>{banner.linkUrl}</span>
                  <span>ترتيب {banner.sortOrder}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => runAction(banner.id, 'toggle-active')}
                  className="flex h-8 w-8 items-center justify-center rounded-xl surface-elevated transition-all hover:text-primary"
                >
                  {banner.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button
                  type="button"
                  onClick={() => runAction(banner.id, 'delete')}
                  className="flex h-8 w-8 items-center justify-center rounded-xl surface-elevated transition-all hover:text-error"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
