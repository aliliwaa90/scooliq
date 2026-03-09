'use client';

import { AdminSidebar, AdminMobileNav } from '../videos/page';
import { Save, Globe, Shield, Palette } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="min-h-screen flex">
      <AdminSidebar active="settings" />
      <main className="flex-1 p-4 md:p-6 mt-14 md:mt-0 mb-20 md:mb-0">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl font-bold mb-6">إعدادات المنصة</h1>

          <div className="space-y-4">
            <div className="card p-5 fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Globe size={18} className="text-primary" />
                <h3 className="font-bold">معلومات المنصة</h3>
              </div>
              <div className="space-y-3">
                <div><label className="text-xs text-muted font-semibold block mb-1">اسم المنصة</label>
                <input defaultValue="حقيبة الطالب العراقي" className="input-field text-sm" /></div>
                <div><label className="text-xs text-muted font-semibold block mb-1">الوصف</label>
                <textarea defaultValue="منصة تعليمية شاملة للطلاب العراقيين" className="input-field text-sm min-h-[60px] resize-none" /></div>
                <div><label className="text-xs text-muted font-semibold block mb-1">رابط تيليجرام</label>
                <input defaultValue="@haqeeba_bot" className="input-field text-sm" /></div>
              </div>
            </div>

            <div className="card p-5 fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-2 mb-4">
                <Shield size={18} className="text-success" />
                <h3 className="font-bold">إعدادات النظام</h3>
              </div>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 rounded-xl surface-elevated">
                  <span className="text-sm font-semibold">وضع الصيانة</span>
                  <div className="w-11 h-6 rounded-full bg-gray-300 dark:bg-gray-600 relative cursor-pointer">
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-[22px] shadow"></div>
                  </div>
                </label>
                <label className="flex items-center justify-between p-3 rounded-xl surface-elevated">
                  <span className="text-sm font-semibold">السماح بالتسجيل</span>
                  <div className="w-11 h-6 rounded-full bg-primary relative cursor-pointer">
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow"></div>
                  </div>
                </label>
              </div>
            </div>

            <button className="btn-primary w-full"><Save size={16} />حفظ الإعدادات</button>
          </div>
          <AdminMobileNav active="settings" />
        </div>
      </main>
    </div>
  );
}
