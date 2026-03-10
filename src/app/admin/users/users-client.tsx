'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useCatalog } from '@/components/catalog-provider';
import { AdminShell } from '@/components/admin/admin-shell';
import type { CatalogUser } from '@/lib/data';
import { Ban, Search, Shield } from 'lucide-react';

export default function AdminUsersClient({
  initialUsers,
}: {
  initialUsers: CatalogUser[];
}) {
  const router = useRouter();
  const { grades } = useCatalog();
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [, startTransition] = useTransition();

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  const filteredUsers = useMemo(
    () =>
      users.filter((user) =>
        [user.firstName, user.lastName, user.username, user.province]
          .join(' ')
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      ),
    [searchQuery, users],
  );

  async function runAction(id: string, action: 'toggle-role' | 'toggle-active') {
    setError('');
    setSuccess('');

    const response = await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action }),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      setError(payload?.message ?? 'تعذر تنفيذ الإجراء.');
      return;
    }

    setSuccess(action === 'toggle-role' ? 'تم تحديث صلاحيات المستخدم.' : 'تم تحديث حالة المستخدم.');
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <AdminShell
      active="users"
      title="إدارة المستخدمين"
      subtitle={`${users.length} مستخدم فعلي محفوظ في قاعدة البيانات.`}
    >
      {error ? <div className="mb-4 rounded-2xl border border-error/20 bg-error/10 px-4 py-3 text-sm text-error">{error}</div> : null}
      {success ? <div className="mb-4 rounded-2xl border border-success/20 bg-success/10 px-4 py-3 text-sm text-success">{success}</div> : null}

      <div className="relative mb-4">
        <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          className="input-field pr-9 text-sm"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="ابحث عن اسم أو معرف أو محافظة..."
        />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="surface-elevated text-right">
                <th className="p-3 text-muted">المستخدم</th>
                <th className="p-3 text-muted hidden md:table-cell">الصف</th>
                <th className="p-3 text-muted hidden md:table-cell">المحافظة</th>
                <th className="p-3 text-muted">الدور</th>
                <th className="p-3 text-muted">الحالة</th>
                <th className="p-3 text-muted">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t border-theme">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-black text-white">
                        {user.firstName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-muted">@{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 hidden md:table-cell text-muted">
                    {grades.find((grade) => grade.id === user.grade)?.name ?? user.grade}
                  </td>
                  <td className="p-3 hidden md:table-cell text-muted">{user.province}</td>
                  <td className="p-3">
                    <span className={`badge text-[10px] ${user.role === 'admin' ? 'badge-accent' : 'badge-primary'}`}>
                      {user.role === 'admin' ? 'مدير' : 'طالب'}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`badge text-[10px] ${user.isActive ? 'badge-success' : 'badge-primary'}`}>
                      {user.isActive ? 'مفعل' : 'معطل'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => runAction(user.id, 'toggle-role')}
                        className="flex h-8 w-8 items-center justify-center rounded-xl surface-elevated transition-all hover:text-accent"
                        title="تبديل الصلاحية"
                      >
                        <Shield size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => runAction(user.id, 'toggle-active')}
                        className="flex h-8 w-8 items-center justify-center rounded-xl surface-elevated transition-all hover:text-error"
                        title="تعطيل أو تفعيل"
                      >
                        <Ban size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
