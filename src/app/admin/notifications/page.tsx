'use client';

import { AdminSidebar, AdminMobileNav } from '../videos/page';
import { useState } from 'react';
import { Bell, Send, Plus, X } from 'lucide-react';

export default function AdminNotifications() {
  const [showForm, setShowForm] = useState(false);
  const [sent, setSent] = useState(false);

  const history = [
    { title: 'فيديو جديد في الرياضيات', audience: 'الكل', date: '2026-03-10' },
    { title: 'اختبار جديد في العلوم', audience: 'الثالث المتوسط', date: '2026-03-09' },
    { title: 'ملزمة جديدة في الإنكليزي', audience: 'الكل', date: '2026-03-08' },
  ];

  return (
    <div className="min-h-screen flex">
      <AdminSidebar active="notifications" />
      <main className="flex-1 p-4 md:p-6 mt-14 md:mt-0 mb-20 md:mb-0">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold">إدارة الإشعارات</h1>
            <button onClick={() => { setShowForm(!showForm); setSent(false); }} className="btn-primary text-sm"><Plus size={16} />إشعار جديد</button>
          </div>

          {showForm && (
            <div className="card p-5 mb-6 fade-in">
              {sent ? (
                <div className="text-center py-6">
                  <Send size={28} className="text-success mx-auto mb-3" />
                  <h3 className="font-bold">تم الإرسال!</h3>
                  <button onClick={() => setShowForm(false)} className="btn-primary mt-3 text-sm">إغلاق</button>
                </div>
              ) : (
                <div className="space-y-3">
                  <input placeholder="عنوان الإشعار" className="input-field text-sm" />
                  <textarea placeholder="نص الإشعار..." className="input-field text-sm min-h-[80px] resize-none" />
                  <select className="input-field text-sm">
                    <option>جميع المستخدمين</option>
                    <option>المرحلة المتوسطة</option>
                    <option>المرحلة الإعدادية</option>
                  </select>
                  <button onClick={() => setSent(true)} className="btn-primary text-sm w-full"><Send size={14} />إرسال</button>
                </div>
              )}
            </div>
          )}

          <div className="card overflow-hidden">
            <h3 className="font-bold p-4 border-b border-theme">سجل الإشعارات</h3>
            <table className="w-full text-sm">
              <thead><tr className="surface-elevated text-right">
                <th className="p-3 text-muted">#</th><th className="p-3 text-muted">العنوان</th>
                <th className="p-3 text-muted">الجمهور</th><th className="p-3 text-muted">التاريخ</th>
              </tr></thead>
              <tbody>
                {history.map((n, i) => (
                  <tr key={i} className="border-t border-theme">
                    <td className="p-3 text-muted">{i+1}</td>
                    <td className="p-3 font-semibold">{n.title}</td>
                    <td className="p-3"><span className="badge badge-primary text-[10px]">{n.audience}</span></td>
                    <td className="p-3 text-muted">{n.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AdminMobileNav active="notifications" />
        </div>
      </main>
    </div>
  );
}
