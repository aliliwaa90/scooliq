'use client';

import { useCatalog } from '@/components/catalog-provider';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { BottomNav } from '../page';
import { ArrowRight, Edit3, MapPin, GraduationCap, Star, Clock, Settings, ChevronLeft, BookOpen, Video, FileText, Trophy } from 'lucide-react';
import { useState } from 'react';

export default function ProfilePage() {
  const { provinces, grades } = useCatalog();
  const { user, watchHistory, favorites } = useStore();
  const [editing, setEditing] = useState(false);
  const [province, setProvince] = useState(user?.province || 'بغداد');
  const [grade, setGrade] = useState(user?.grade || 'g9');

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 glass">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-9 h-9 rounded-full surface-elevated flex items-center justify-center">
              <ArrowRight size={18} />
            </Link>
            <h1 className="font-bold text-lg">الملف الشخصي</h1>
          </div>
          <Link href="/settings" className="w-9 h-9 rounded-full surface-elevated flex items-center justify-center">
            <Settings size={18} />
          </Link>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4">
        {/* Profile Card */}
        <div className="card p-5 text-center fade-in">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-light mx-auto flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {user?.firstName?.charAt(0) || 'ط'}
          </div>
          <h2 className="text-xl font-bold mt-3">{user?.firstName} {user?.lastName}</h2>
          <p className="text-sm text-muted">@{user?.username}</p>

          <div className="flex items-center justify-center gap-4 mt-3 text-sm text-muted">
            <span className="flex items-center gap-1"><MapPin size={14} />{province}</span>
            <span className="flex items-center gap-1"><GraduationCap size={14} />{grades.find(g => g.id === grade)?.name}</span>
          </div>

          <button onClick={() => setEditing(!editing)} className="btn-secondary mt-4 text-sm">
            <Edit3 size={14} />
            تعديل البيانات
          </button>
        </div>

        {/* Edit Form */}
        {editing && (
          <div className="card p-4 mt-3 fade-in">
            <h3 className="font-bold text-sm mb-3">تعديل البيانات</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted block mb-1">المحافظة</label>
                <select value={province} onChange={e => setProvince(e.target.value)} className="input-field text-sm">
                  {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted block mb-1">الصف الدراسي</label>
                <select value={grade} onChange={e => setGrade(e.target.value)} className="input-field text-sm">
                  {grades.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>
              <button onClick={() => setEditing(false)} className="btn-primary w-full text-sm">حفظ التغييرات</button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4 fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="card p-3 text-center">
            <Star size={20} className="mx-auto text-accent mb-1" />
            <p className="font-bold text-lg">{favorites.length}</p>
            <p className="text-[10px] text-muted">المفضلة</p>
          </div>
          <div className="card p-3 text-center">
            <Clock size={20} className="mx-auto text-primary mb-1" />
            <p className="font-bold text-lg">{watchHistory.length}</p>
            <p className="text-[10px] text-muted">مشاهدة</p>
          </div>
          <div className="card p-3 text-center">
            <Trophy size={20} className="mx-auto text-success mb-1" />
            <p className="font-bold text-lg">0</p>
            <p className="text-[10px] text-muted">اختبارات</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-4 space-y-2 fade-in" style={{ animationDelay: '0.2s' }}>
          {[
            { icon: <Star size={18} className="text-accent" />, label: 'المفضلة', href: '/favorites' },
            { icon: <Clock size={18} className="text-primary" />, label: 'سجل المشاهدة', href: '/history' },
            { icon: <Trophy size={18} className="text-success" />, label: 'نتائج الاختبارات', href: '/quizzes' },
            { icon: <Settings size={18} className="text-muted" />, label: 'الإعدادات', href: '/settings' },
          ].map((item, i) => (
            <Link key={i} href={item.href} className="card p-3.5 flex items-center gap-3 hover:scale-[1.01] transition-all">
              {item.icon}
              <span className="text-sm font-semibold flex-1">{item.label}</span>
              <ChevronLeft size={16} className="text-muted" />
            </Link>
          ))}
        </div>
      </main>

      <BottomNav active="profile" />
    </div>
  );
}
