'use client';

import Link from 'next/link';
import { useCatalog } from '@/components/catalog-provider';
import { useState } from 'react';
import { AdminSidebar, AdminMobileNav } from '../videos/page';
import { FileText, Plus, Search, Edit, Trash2, Download, X, Save } from 'lucide-react';

export default function AdminHandouts() {
  const { handouts, subjects, grades } = useCatalog();
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const filtered = handouts.filter(h => h.title.includes(searchQuery));
  const typeLabels: Record<string, string> = { handout: 'ملزمة', book: 'كتاب', summary: 'ملخص' };

  return (
    <div className="min-h-screen flex">
      <AdminSidebar active="handouts" />

      <main className="flex-1 p-4 md:p-6 mt-14 md:mt-0 mb-20 md:mb-0">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h1 className="text-xl font-bold">إدارة الملازم والكتب</h1>
              <p className="text-sm text-muted">{handouts.length} ملف</p>
            </div>
            <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">
              <Plus size={16} />
              إضافة ملف
            </button>
          </div>

          {showForm && (
            <div className="card p-5 mb-6 fade-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">إضافة ملف جديد</h3>
                <button onClick={() => setShowForm(false)}><X size={18} className="text-muted" /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input placeholder="عنوان الملف" className="input-field text-sm" />
                <select className="input-field text-sm">
                  <option value="">نوع الملف</option>
                  <option value="handout">ملزمة</option>
                  <option value="book">كتاب</option>
                  <option value="summary">ملخص</option>
                </select>
                <select className="input-field text-sm">
                  <option value="">اختر المادة</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted font-semibold">ملف PDF</label>
                  <input type="file" accept=".pdf" className="input-field text-sm" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted font-semibold">صورة الغلاف</label>
                  <input type="file" accept="image/*" className="input-field text-sm" />
                </div>
              </div>
              <button className="btn-primary mt-3 text-sm"><Save size={14} />حفظ</button>
            </div>
          )}

          <div className="relative mb-4">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="ابحث..." className="input-field text-sm pr-9" />
          </div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="surface-elevated text-right">
                    <th className="p-3 font-semibold text-muted">#</th>
                    <th className="p-3 font-semibold text-muted">العنوان</th>
                    <th className="p-3 font-semibold text-muted hidden md:table-cell">النوع</th>
                    <th className="p-3 font-semibold text-muted hidden md:table-cell">المادة</th>
                    <th className="p-3 font-semibold text-muted hidden md:table-cell">الحجم</th>
                    <th className="p-3 font-semibold text-muted hidden md:table-cell">التحميلات</th>
                    <th className="p-3 font-semibold text-muted">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((h, i) => {
                    const subj = subjects.find(s => s.id === h.subjectId);
                    return (
                      <tr key={h.id} className="border-t border-theme hover:surface-elevated transition-all">
                        <td className="p-3 text-muted">{i + 1}</td>
                        <td className="p-3">
                          <p className="font-semibold truncate max-w-[200px]">{h.title}</p>
                        </td>
                        <td className="p-3 hidden md:table-cell">
                          <span className="badge badge-accent text-[10px]">{typeLabels[h.type]}</span>
                        </td>
                        <td className="p-3 hidden md:table-cell"><span className="badge badge-primary text-[10px]">{subj?.name}</span></td>
                        <td className="p-3 hidden md:table-cell text-muted">{h.fileSize}</td>
                        <td className="p-3 hidden md:table-cell text-muted">{h.downloads.toLocaleString('ar-EG')}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <button className="w-7 h-7 rounded-lg surface-elevated flex items-center justify-center hover:text-primary transition-all"><Edit size={13} /></button>
                            <button className="w-7 h-7 rounded-lg surface-elevated flex items-center justify-center hover:text-error transition-all"><Trash2 size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <AdminMobileNav active="handouts" />
        </div>
      </main>
    </div>
  );
}
