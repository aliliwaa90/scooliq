'use client';

import { AdminSidebar, AdminMobileNav } from '../videos/page';
import { Users, Search, Shield, Ban } from 'lucide-react';
import { useState } from 'react';

const mockUsers = [
  { id: 'u1', name: 'أحمد محمد', username: 'ahmed_m', stage: 'متوسط', grade: 'الثالث المتوسط', province: 'بغداد', role: 'student', joinDate: '2026-01-15' },
  { id: 'u2', name: 'فاطمة علي', username: 'fatima_a', stage: 'إعدادي', grade: 'السادس الإعدادي', province: 'البصرة', role: 'student', joinDate: '2026-02-01' },
  { id: 'u3', name: 'حسين كريم', username: 'hussein_k', stage: 'متوسط', grade: 'الثاني المتوسط', province: 'كربلاء', role: 'student', joinDate: '2026-02-10' },
  { id: 'u4', name: 'زينب حسن', username: 'zainab_h', stage: 'ابتدائي', grade: 'السادس الابتدائي', province: 'النجف', role: 'student', joinDate: '2026-02-20' },
  { id: 'u5', name: 'محمد عبد الله', username: 'mohammed_a', stage: 'إعدادي', grade: 'الخامس الإعدادي', province: 'أربيل', role: 'admin', joinDate: '2026-01-01' },
];

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const filtered = mockUsers.filter(u => u.name.includes(searchQuery) || u.username.includes(searchQuery));

  return (
    <div className="min-h-screen flex">
      <AdminSidebar active="users" />

      <main className="flex-1 p-4 md:p-6 mt-14 md:mt-0 mb-20 md:mb-0">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold">إدارة المستخدمين</h1>
              <p className="text-sm text-muted">{mockUsers.length} مستخدم</p>
            </div>
          </div>

          <div className="relative mb-4">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="ابحث عن مستخدم..." className="input-field text-sm pr-9" />
          </div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="surface-elevated text-right">
                    <th className="p-3 font-semibold text-muted">#</th>
                    <th className="p-3 font-semibold text-muted">الاسم</th>
                    <th className="p-3 font-semibold text-muted hidden md:table-cell">المستخدم</th>
                    <th className="p-3 font-semibold text-muted hidden md:table-cell">الصف</th>
                    <th className="p-3 font-semibold text-muted hidden md:table-cell">المحافظة</th>
                    <th className="p-3 font-semibold text-muted">الدور</th>
                    <th className="p-3 font-semibold text-muted hidden md:table-cell">التسجيل</th>
                    <th className="p-3 font-semibold text-muted">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u, i) => (
                    <tr key={u.id} className="border-t border-theme hover:surface-elevated transition-all">
                      <td className="p-3 text-muted">{i + 1}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-xs font-bold">{u.name.charAt(0)}</div>
                          <span className="font-semibold">{u.name}</span>
                        </div>
                      </td>
                      <td className="p-3 hidden md:table-cell text-muted">@{u.username}</td>
                      <td className="p-3 hidden md:table-cell text-muted">{u.grade}</td>
                      <td className="p-3 hidden md:table-cell text-muted">{u.province}</td>
                      <td className="p-3">
                        {u.role === 'admin' ? (
                          <span className="badge badge-accent text-[10px]">مدير</span>
                        ) : (
                          <span className="badge badge-primary text-[10px]">طالب</span>
                        )}
                      </td>
                      <td className="p-3 hidden md:table-cell text-muted">{u.joinDate}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <button className="w-7 h-7 rounded-lg surface-elevated flex items-center justify-center hover:text-accent transition-all" title="ترقية"><Shield size={13} /></button>
                          <button className="w-7 h-7 rounded-lg surface-elevated flex items-center justify-center hover:text-error transition-all" title="حظر"><Ban size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <AdminMobileNav active="users" />
        </div>
      </main>
    </div>
  );
}
