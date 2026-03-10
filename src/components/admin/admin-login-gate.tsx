'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, LogIn, ShieldAlert } from 'lucide-react';

export default function AdminLoginGate({
  databaseReady,
}: {
  databaseReady: boolean;
}) {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        setError(payload?.message ?? 'فشل تسجيل الدخول.');
        return;
      }

      router.refresh();
    } catch {
      setError('تعذر الوصول إلى الخادم حالياً.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-[28px] border border-theme bg-white/90 p-6 shadow-2xl shadow-black/5 dark:bg-neutral-950/90">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[22px] gradient-hero text-white shadow-lg">
            <Lock size={28} />
          </div>
          <h1 className="text-2xl font-black">دخول الإدارة</h1>
          <p className="mt-2 text-sm text-muted">
            نفس رابط <code>/admin</code> سيعرض اللوحة بعد تسجيل الدخول مباشرة.
          </p>
        </div>

        {!databaseReady ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-100">
            <div className="mb-2 flex items-center gap-2 font-bold">
              <ShieldAlert size={16} />
              قاعدة البيانات غير مفعلة
            </div>
            أضف متغيرات Supabase أولاً ثم أعد تحميل الصفحة.
          </div>
        ) : (
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1 block text-xs font-bold text-muted">المعرف</label>
              <input
                className="input-field text-sm"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="اسم المدير"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-muted">كلمة السر</label>
              <input
                className="input-field text-sm"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="كلمة المرور"
              />
            </div>

            {error ? (
              <div className="rounded-2xl border border-error/20 bg-error/10 px-3 py-2 text-sm text-error">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-70"
            >
              <LogIn size={16} />
              {loading ? 'جار تسجيل الدخول...' : 'دخول لوحة التحكم'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
