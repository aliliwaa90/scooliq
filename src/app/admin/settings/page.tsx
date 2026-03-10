'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useCatalog } from '@/components/catalog-provider';
import { AdminShell } from '@/components/admin/admin-shell';
import { Globe, Save, Shield } from 'lucide-react';

export default function AdminSettingsPage() {
  const router = useRouter();
  const { siteSettings } = useCatalog();
  const [form, setForm] = useState({
    siteName: siteSettings.siteName,
    siteDescription: siteSettings.siteDescription,
    telegramHandle: siteSettings.telegramHandle,
    maintenanceMode: siteSettings.maintenanceMode,
    allowRegistration: siteSettings.allowRegistration,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');

    const response = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      setError(payload?.message ?? 'تعذر حفظ الإعدادات.');
      return;
    }

    setSuccess('تم تحديث إعدادات المنصة.');
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <AdminShell
      active="settings"
      title="إعدادات المنصة"
      subtitle="هذه القيم مرتبطة فعلياً بالصفحة الرئيسية ولوحة التحكم."
    >
      {error ? <div className="mb-4 rounded-2xl border border-error/20 bg-error/10 px-4 py-3 text-sm text-error">{error}</div> : null}
      {success ? <div className="mb-4 rounded-2xl border border-success/20 bg-success/10 px-4 py-3 text-sm text-success">{success}</div> : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="card p-5">
          <div className="mb-4 flex items-center gap-2">
            <Globe size={18} className="text-primary" />
            <h2 className="font-bold">الهوية العامة</h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-bold text-muted">اسم المنصة</label>
              <input className="input-field text-sm" value={form.siteName} onChange={(event) => setForm((current) => ({ ...current, siteName: event.target.value }))} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-muted">الوصف</label>
              <textarea className="input-field min-h-[90px] resize-none text-sm" value={form.siteDescription} onChange={(event) => setForm((current) => ({ ...current, siteDescription: event.target.value }))} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-muted">معرف تيليجرام</label>
              <input className="input-field text-sm" value={form.telegramHandle} onChange={(event) => setForm((current) => ({ ...current, telegramHandle: event.target.value }))} />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="mb-4 flex items-center gap-2">
            <Shield size={18} className="text-success" />
            <h2 className="font-bold">حالة النظام</h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between rounded-2xl surface-elevated px-4 py-3">
              <div>
                <p className="font-bold">وضع الصيانة</p>
                <p className="text-xs text-muted">إظهار تنبيه صيانة في الصفحة الرئيسية.</p>
              </div>
              <input type="checkbox" checked={form.maintenanceMode} onChange={(event) => setForm((current) => ({ ...current, maintenanceMode: event.target.checked }))} className="h-5 w-5 accent-primary" />
            </label>

            <label className="flex items-center justify-between rounded-2xl surface-elevated px-4 py-3">
              <div>
                <p className="font-bold">السماح بالتسجيل</p>
                <p className="text-xs text-muted">يظهر في الواجهة العامة كحالة التسجيل.</p>
              </div>
              <input type="checkbox" checked={form.allowRegistration} onChange={(event) => setForm((current) => ({ ...current, allowRegistration: event.target.checked }))} className="h-5 w-5 accent-primary" />
            </label>
          </div>
        </div>

        <button type="submit" disabled={isPending} className="btn-primary">
          <Save size={16} />
          {isPending ? 'جار الحفظ...' : 'حفظ الإعدادات'}
        </button>
      </form>
    </AdminShell>
  );
}
