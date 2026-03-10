'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useCatalog } from '@/components/catalog-provider';
import { AdminShell } from '@/components/admin/admin-shell';
import { Bell, Plus, Send, X } from 'lucide-react';

const initialForm = {
  title: '',
  message: '',
  type: 'announcement',
  audience: 'all',
};

const audienceLabels: Record<string, string> = {
  all: 'كل المستخدمين',
  'third-intermediate': 'الثالث المتوسط',
  'sixth-preparatory': 'السادس الإعدادي',
};

export default function AdminNotificationsPage() {
  const router = useRouter();
  const { notifications } = useCatalog();
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

    const response = await fetch('/api/admin/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      setError(payload?.message ?? 'تعذر إرسال الإشعار.');
      return;
    }

    setForm(initialForm);
    setShowForm(false);
    setSuccess('تم حفظ الإشعار وسيظهر مباشرة في صفحة الإشعارات.');
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <AdminShell
      active="notifications"
      title="إدارة الإشعارات"
      subtitle="الإشعارات المحفوظة هنا تظهر مباشرة في واجهة المستخدم."
      actions={
        <button type="button" onClick={() => setShowForm((value) => !value)} className="btn-primary text-sm">
          <Plus size={16} />
          {showForm ? 'إغلاق النموذج' : 'إشعار جديد'}
        </button>
      }
    >
      {error ? <div className="mb-4 rounded-2xl border border-error/20 bg-error/10 px-4 py-3 text-sm text-error">{error}</div> : null}
      {success ? <div className="mb-4 rounded-2xl border border-success/20 bg-success/10 px-4 py-3 text-sm text-success">{success}</div> : null}

      {showForm ? (
        <form onSubmit={handleSubmit} className="card mb-6 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">إشعار جديد</h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-muted">
              <X size={18} />
            </button>
          </div>

          <div className="space-y-3">
            <input className="input-field text-sm" placeholder="عنوان الإشعار" value={form.title} onChange={(event) => updateField('title', event.target.value)} />
            <textarea className="input-field min-h-[100px] resize-none text-sm" placeholder="نص الإشعار" value={form.message} onChange={(event) => updateField('message', event.target.value)} />
            <div className="grid gap-3 md:grid-cols-2">
              <select className="input-field text-sm" value={form.type} onChange={(event) => updateField('type', event.target.value)}>
                <option value="announcement">إعلان</option>
                <option value="content">محتوى جديد</option>
                <option value="quiz">اختبار</option>
                <option value="review">مراجعة</option>
              </select>
              <select className="input-field text-sm" value={form.audience} onChange={(event) => updateField('audience', event.target.value)}>
                <option value="all">كل المستخدمين</option>
                <option value="third-intermediate">الثالث المتوسط</option>
                <option value="sixth-preparatory">السادس الإعدادي</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={isPending} className="btn-primary mt-4 text-sm">
            <Send size={15} />
            {isPending ? 'جار الإرسال...' : 'حفظ الإشعار'}
          </button>
        </form>
      ) : null}

      <div className="grid gap-3">
        {notifications.map((notification) => (
          <div key={notification.id} className="card p-4">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-error/10 text-error">
                <Bell size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <h3 className="font-bold">{notification.title}</h3>
                  <span className="badge badge-primary text-[10px]">
                    {audienceLabels[notification.audience] ?? notification.audience}
                  </span>
                </div>
                <p className="text-sm text-muted">{notification.message}</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted">
                  <span>{notification.createdAt}</span>
                  <span>{notification.type}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
