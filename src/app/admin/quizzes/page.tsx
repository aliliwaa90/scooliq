'use client';

import { AdminSidebar, AdminMobileNav } from '../videos/page';
import { useCatalog } from '@/components/catalog-provider';
import Link from 'next/link';
import { useState } from 'react';
import { ClipboardList, Plus, Search, Edit, Trash2, X, Save } from 'lucide-react';

export default function AdminQuizzes() {
  const { quizzes, subjects } = useCatalog();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen flex">
      <AdminSidebar active="quizzes" />

      <main className="flex-1 p-4 md:p-6 mt-14 md:mt-0 mb-20 md:mb-0">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h1 className="text-xl font-bold">إدارة الاختبارات</h1>
              <p className="text-sm text-muted">{quizzes.length} اختبار</p>
            </div>
            <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">
              <Plus size={16} />
              إضافة اختبار
            </button>
          </div>

          {showForm && (
            <div className="card p-5 mb-6 fade-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">إضافة اختبار جديد</h3>
                <button onClick={() => setShowForm(false)}><X size={18} className="text-muted" /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input placeholder="عنوان الاختبار" className="input-field text-sm" />
                <select className="input-field text-sm">
                  <option value="">اختر المادة</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <input placeholder="الفصل / الوحدة" className="input-field text-sm" />
                <input type="number" placeholder="المدة بالدقائق" className="input-field text-sm" />
              </div>

              <div className="mt-4 border border-theme rounded-xl p-4">
                <h4 className="font-semibold text-sm mb-3">إضافة أسئلة</h4>
                <div className="space-y-3">
                  <input placeholder="نص السؤال" className="input-field text-sm" />
                  <select className="input-field text-sm">
                    <option value="mcq">اختيار من متعدد</option>
                    <option value="truefalse">صح وخطأ</option>
                  </select>
                  <div className="grid grid-cols-2 gap-2">
                    <input placeholder="الخيار الأول" className="input-field text-sm" />
                    <input placeholder="الخيار الثاني" className="input-field text-sm" />
                    <input placeholder="الخيار الثالث" className="input-field text-sm" />
                    <input placeholder="الخيار الرابع" className="input-field text-sm" />
                  </div>
                  <input type="number" placeholder="رقم الإجابة الصحيحة (0-3)" className="input-field text-sm" />
                  <input placeholder="توضيح الإجابة" className="input-field text-sm" />
                  <button className="btn-secondary text-xs"><Plus size={14} />إضافة السؤال</button>
                </div>
              </div>
              <button className="btn-primary mt-3 text-sm"><Save size={14} />حفظ الاختبار</button>
            </div>
          )}

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="surface-elevated text-right">
                    <th className="p-3 font-semibold text-muted">#</th>
                    <th className="p-3 font-semibold text-muted">العنوان</th>
                    <th className="p-3 font-semibold text-muted hidden md:table-cell">المادة</th>
                    <th className="p-3 font-semibold text-muted hidden md:table-cell">الأسئلة</th>
                    <th className="p-3 font-semibold text-muted hidden md:table-cell">المدة</th>
                    <th className="p-3 font-semibold text-muted hidden md:table-cell">المحاولات</th>
                    <th className="p-3 font-semibold text-muted">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {quizzes.map((q, i) => {
                    const subj = subjects.find(s => s.id === q.subjectId);
                    return (
                      <tr key={q.id} className="border-t border-theme hover:surface-elevated transition-all">
                        <td className="p-3 text-muted">{i + 1}</td>
                        <td className="p-3 font-semibold">{q.title}</td>
                        <td className="p-3 hidden md:table-cell"><span className="badge badge-primary text-[10px]">{subj?.name}</span></td>
                        <td className="p-3 hidden md:table-cell text-muted">{q.questionCount}</td>
                        <td className="p-3 hidden md:table-cell text-muted">{q.duration} د</td>
                        <td className="p-3 hidden md:table-cell text-muted">{q.attempts.toLocaleString('ar-EG')}</td>
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

          <AdminMobileNav active="quizzes" />
        </div>
      </main>
    </div>
  );
}
