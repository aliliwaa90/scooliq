'use client';

import { AdminSidebar, AdminMobileNav } from '../videos/page';
import { useState } from 'react';
import { Image, Plus, Trash2, X, Save, Eye, EyeOff } from 'lucide-react';

export default function AdminBanners() {
  const [showForm, setShowForm] = useState(false);
  const banners = [
    { id: 1, title: 'بانر الصفحة الرئيسية', link: '/', active: true },
    { id: 2, title: 'إعلان المراجعة النهائية', link: '/quizzes', active: true },
    { id: 3, title: 'عرض خاص - ملازم مجانية', link: '/handouts', active: false },
  ];

  return (
    <div className="min-h-screen flex">
      <AdminSidebar active="banners" />
      <main className="flex-1 p-4 md:p-6 mt-14 md:mt-0 mb-20 md:mb-0">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold">إدارة البانرات</h1>
            <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm"><Plus size={16} />إضافة بانر</button>
          </div>

          {showForm && (
            <div className="card p-5 mb-6 fade-in">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold">بانر جديد</h3>
                <button onClick={() => setShowForm(false)}><X size={18} className="text-muted" /></button>
              </div>
              <div className="space-y-3">
                <input placeholder="عنوان البانر" className="input-field text-sm" />
                <input placeholder="الرابط" className="input-field text-sm" />
                <div><label className="text-xs text-muted font-semibold block mb-1">صورة البانر</label>
                <input type="file" accept="image/*" className="input-field text-sm" /></div>
                <button className="btn-primary text-sm"><Save size={14} />حفظ</button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {banners.map(b => (
              <div key={b.id} className="card p-4 flex items-center gap-4">
                <div className="w-24 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                  <Image size={20} className="text-primary/50" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{b.title}</h3>
                  <p className="text-xs text-muted">{b.link}</p>
                </div>
                <span className={`badge text-[10px] ${b.active ? 'badge-success' : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                  {b.active ? 'فعّال' : 'معطّل'}
                </span>
                <button className="w-7 h-7 rounded-lg surface-elevated flex items-center justify-center hover:text-error"><Trash2 size={13} /></button>
              </div>
            ))}
          </div>
          <AdminMobileNav active="banners" />
        </div>
      </main>
    </div>
  );
}
