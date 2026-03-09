'use client';

import Link from 'next/link';
import { BottomNav } from '../page';
import { ArrowRight, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  { q: 'ما هي حقيبة الطالب العراقي؟', a: 'هي منصة تعليمية شاملة مخصصة للطلاب العراقيين، توفر فيديوهات تعليمية، ملازم، كتب، اختبارات ومراجعات منظمة حسب المرحلة والصف والمادة.' },
  { q: 'هل المنصة مجانية؟', a: 'نعم، معظم المحتوى التعليمي متاح مجاناً. قد تتوفر محتويات مميزة إضافية في المستقبل.' },
  { q: 'كيف أبدأ استخدام المنصة؟', a: 'يمكنك فتح المنصة من داخل تيليجرام عبر البوت الخاص بنا، أو زيارة الموقع مباشرة. اختر المرحلة والصف وابدأ التعلم!' },
  { q: 'هل الاختبارات تفاعلية؟', a: 'نعم، الاختبارات إلكترونية وتفاعلية بالكامل. تحصل على نتيجتك فوراً مع توضيح الإجابات الصحيحة والخاطئة.' },
  { q: 'كيف أحفظ المحتوى في المفضلة؟', a: 'اضغط على أيقونة النجمة ⭐ بجانب أي فيديو أو ملزمة لحفظها في المفضلة والوصول إليها بسرعة لاحقاً.' },
  { q: 'هل يمكنني تحميل الملازم والكتب؟', a: 'نعم، جميع الملازم والكتب متاحة للتحميل بصيغة PDF بشكل مباشر.' },
  { q: 'كيف أتواصل مع الدعم؟', a: 'يمكنك التواصل معنا عبر صفحة "تواصل معنا" أو من خلال بوت تيليجرام الخاص بالمنصة.' },
  { q: 'هل المنصة متوافقة مع المنهج العراقي؟', a: 'نعم، جميع المواد التعليمية مبنية بالكامل على المنهج العراقي المعتمد من وزارة التربية.' },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 glass">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="w-9 h-9 rounded-full surface-elevated flex items-center justify-center">
            <ArrowRight size={18} />
          </Link>
          <h1 className="font-bold text-lg">الأسئلة الشائعة</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4">
        <div className="text-center mb-6 fade-in">
          <HelpCircle size={40} className="mx-auto text-primary mb-2" />
          <p className="text-sm text-muted">إجابات على أكثر الأسئلة شيوعاً</p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="card overflow-hidden fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full p-4 flex items-center gap-3 text-right"
              >
                <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary">{i + 1}</span>
                <span className="text-sm font-bold flex-1">{faq.q}</span>
                {open === i ? <ChevronUp size={16} className="text-muted" /> : <ChevronDown size={16} className="text-muted" />}
              </button>
              {open === i && (
                <div className="px-4 pb-4 pr-14 fade-in">
                  <p className="text-sm text-muted leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      <BottomNav active="home" />
    </div>
  );
}
