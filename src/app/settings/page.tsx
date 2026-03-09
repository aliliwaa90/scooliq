'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { ArrowRight, Sun, Moon, Bell, Globe, Shield, Info, ChevronLeft } from 'lucide-react';
import { BottomNav } from '../page';

export default function SettingsPage() {
  const { isDark, toggleTheme } = useStore();

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 glass">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/profile" className="w-9 h-9 rounded-full surface-elevated flex items-center justify-center">
            <ArrowRight size={18} />
          </Link>
          <h1 className="font-bold text-lg">الإعدادات</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4 space-y-6">
        {/* Theme */}
        <div className="fade-in">
          <h3 className="text-xs font-bold text-muted mb-2 pr-1">المظهر</h3>
          <div className="card overflow-hidden">
            <div onClick={toggleTheme} className="p-3.5 flex items-center gap-3 cursor-pointer hover:surface-elevated transition-all">
              {isDark ? <Moon size={18} className="text-primary" /> : <Sun size={18} className="text-accent" />}
              <span className="text-sm font-semibold flex-1">{isDark ? 'الوضع الليلي' : 'الوضع النهاري'}</span>
              <div className={`w-11 h-6 rounded-full relative transition-all ${isDark ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}>
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow ${isDark ? 'left-0.5' : 'left-[22px]'}`}></div>
              </div>
            </div>
          </div>
        </div>

        {/* General */}
        <div className="fade-in" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-xs font-bold text-muted mb-2 pr-1">عام</h3>
          <div className="card overflow-hidden">
            <Link href="/notifications" className="p-3.5 flex items-center gap-3 cursor-pointer hover:surface-elevated transition-all">
              <Bell size={18} className="text-primary" />
              <span className="text-sm font-semibold flex-1">الإشعارات</span>
              <ChevronLeft size={16} className="text-muted" />
            </Link>
            <div className="p-3.5 flex items-center gap-3 border-t border-theme">
              <Globe size={18} className="text-success" />
              <span className="text-sm font-semibold flex-1">اللغة</span>
              <span className="text-xs text-muted">العربية</span>
              <ChevronLeft size={16} className="text-muted" />
            </div>
          </div>
        </div>

        {/* About */}
        <div className="fade-in" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-xs font-bold text-muted mb-2 pr-1">حول</h3>
          <div className="card overflow-hidden">
            <Link href="/about" className="p-3.5 flex items-center gap-3 cursor-pointer hover:surface-elevated transition-all">
              <Info size={18} className="text-primary" />
              <span className="text-sm font-semibold flex-1">حول المنصة</span>
              <ChevronLeft size={16} className="text-muted" />
            </Link>
            <div className="p-3.5 flex items-center gap-3 border-t border-theme cursor-pointer hover:surface-elevated transition-all">
              <Shield size={18} className="text-muted" />
              <span className="text-sm font-semibold flex-1">سياسة الخصوصية</span>
              <ChevronLeft size={16} className="text-muted" />
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted mt-8">حقيبة الطالب العراقي — النسخة 1.0.0</p>
      </main>

      <BottomNav active="profile" />
    </div>
  );
}
