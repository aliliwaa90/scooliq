'use client';

import Link from 'next/link';
import { BottomNav } from '../page';
import { ArrowRight, Send, MessageCircle, Phone, Mail, MapPin } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 glass">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="w-9 h-9 rounded-full surface-elevated flex items-center justify-center">
            <ArrowRight size={18} />
          </Link>
          <h1 className="font-bold text-lg">تواصل معنا</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4">
        <div className="text-center mb-6 fade-in">
          <MessageCircle size={40} className="mx-auto text-primary mb-2" />
          <h2 className="font-bold text-lg">نسعد بتواصلك معنا</h2>
          <p className="text-sm text-muted mt-1">لأي استفسار أو اقتراح أو مشكلة تقنية</p>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-2 gap-3 mb-6 fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="card p-4 text-center">
            <MessageCircle size={24} className="mx-auto text-primary mb-2" />
            <p className="text-xs font-semibold">تيليجرام</p>
            <p className="text-xs text-muted mt-1">@haqeeba_support</p>
          </div>
          <div className="card p-4 text-center">
            <Mail size={24} className="mx-auto text-success mb-2" />
            <p className="text-xs font-semibold">البريد الإلكتروني</p>
            <p className="text-xs text-muted mt-1">info@haqeeba.iq</p>
          </div>
        </div>

        {/* Contact Form */}
        {sent ? (
          <div className="card p-8 text-center fade-in">
            <div className="w-16 h-16 rounded-full bg-success/10 mx-auto flex items-center justify-center mb-4">
              <Send size={28} className="text-success" />
            </div>
            <h3 className="font-bold text-lg">تم إرسال رسالتك بنجاح!</h3>
            <p className="text-sm text-muted mt-2">سنرد عليك في أقرب وقت ممكن</p>
            <button onClick={() => setSent(false)} className="btn-primary mt-4">إرسال رسالة أخرى</button>
          </div>
        ) : (
          <div className="card p-4 fade-in" style={{ animationDelay: '0.15s' }}>
            <h3 className="font-bold text-sm mb-3">أرسل لنا رسالة</h3>
            <div className="space-y-3">
              <input type="text" placeholder="الاسم الكامل" className="input-field" />
              <input type="email" placeholder="البريد الإلكتروني" className="input-field" dir="ltr" style={{ textAlign: 'right' }} />
              <select className="input-field">
                <option value="">نوع الرسالة</option>
                <option>استفسار عام</option>
                <option>مشكلة تقنية</option>
                <option>اقتراح</option>
                <option>شكوى</option>
              </select>
              <textarea placeholder="اكتب رسالتك هنا..." className="input-field min-h-[120px] resize-none"></textarea>
              <button onClick={() => setSent(true)} className="btn-primary w-full">
                <Send size={16} />
                إرسال الرسالة
              </button>
            </div>
          </div>
        )}
      </main>

      <BottomNav active="home" />
    </div>
  );
}
