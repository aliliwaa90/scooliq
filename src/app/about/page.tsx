'use client';

import Link from 'next/link';
import { BottomNav } from '../page';
import { ArrowRight, GraduationCap, Video, FileText, BookOpen, ClipboardList, Users, Star, Target, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 glass">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="w-9 h-9 rounded-full surface-elevated flex items-center justify-center">
            <ArrowRight size={18} />
          </Link>
          <h1 className="font-bold text-lg">حول المنصة</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4">
        {/* Hero */}
        <div className="gradient-hero rounded-2xl p-6 text-center text-white fade-in relative overflow-hidden">
          <div className="absolute top-4 left-4 w-20 h-20 rounded-full bg-white/10"></div>
          <div className="absolute bottom-4 right-8 w-16 h-16 rounded-full bg-white/5"></div>
          <GraduationCap size={48} className="mx-auto mb-3" />
          <h2 className="text-2xl font-bold">حقيبة الطالب العراقي</h2>
          <p className="text-lg opacity-90 mt-1">تعلّم بذكاء، تميّز بعلم</p>
          <p className="text-sm opacity-70 mt-3">منصتك التعليمية الشاملة لجميع المراحل الدراسية</p>
        </div>

        {/* Mission */}
        <div className="card p-5 mt-4 fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-2 mb-3">
            <Target size={20} className="text-primary" />
            <h3 className="font-bold">رسالتنا</h3>
          </div>
          <p className="text-sm text-muted leading-relaxed">
            نسعى لتوفير محتوى تعليمي عالي الجودة ومتاح مجاناً لكل طالب عراقي، مع تنظيم المحتوى بطريقة ذكية تسهّل عملية التعلم والمراجعة والاستعداد للامتحانات.
          </p>
        </div>

        {/* Features */}
        <div className="card p-5 mt-3 fade-in" style={{ animationDelay: '0.15s' }}>
          <div className="flex items-center gap-2 mb-3">
            <Star size={20} className="text-accent" />
            <h3 className="font-bold">مميزاتنا</h3>
          </div>
          <div className="space-y-3">
            {[
              { icon: <Video size={16} className="text-primary" />, text: 'فيديوهات تعليمية شاملة من أفضل المدرسين' },
              { icon: <FileText size={16} className="text-success" />, text: 'ملازم وملخصات منظمة حسب المنهج العراقي' },
              { icon: <BookOpen size={16} className="text-purple-500" />, text: 'كتب منهجية متاحة للتحميل المجاني' },
              { icon: <ClipboardList size={16} className="text-accent" />, text: 'اختبارات تفاعلية مع نتائج فورية' },
              { icon: <Users size={16} className="text-primary" />, text: 'مجتمع تعليمي متكامل عبر تيليجرام' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg surface-elevated flex items-center justify-center flex-shrink-0">{f.icon}</div>
                <p className="text-sm">{f.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mt-3 fade-in" style={{ animationDelay: '0.2s' }}>
          {[
            { num: '+300', label: 'فيديو' },
            { num: '+150', label: 'ملزمة' },
            { num: '+80', label: 'اختبار' },
            { num: '+12K', label: 'طالب' },
          ].map((s, i) => (
            <div key={i} className="card p-3 text-center">
              <p className="font-bold text-primary text-lg">{s.num}</p>
              <p className="text-[10px] text-muted">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-6 mb-4 text-sm text-muted fade-in" style={{ animationDelay: '0.25s' }}>
          <Heart size={16} className="inline text-error mx-1" />
          <p className="mt-2">صُنع بحب في العراق 🇮🇶</p>
          <p className="text-xs mt-1">الإصدار 1.0.0</p>
        </div>
      </main>

      <BottomNav active="home" />
    </div>
  );
}
