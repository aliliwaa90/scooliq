'use client';

import Link from 'next/link';
import { useCatalog } from '@/components/catalog-provider';
import { BottomNav } from '../page';
import { ArrowRight, BookOpen, Download, Eye } from 'lucide-react';

export default function BooksPage() {
  const { handouts, subjects } = useCatalog();
  const books = handouts.filter(h => h.type === 'book');

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 glass">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="w-9 h-9 rounded-full surface-elevated flex items-center justify-center">
            <ArrowRight size={18} />
          </Link>
          <h1 className="font-bold text-lg">الكتب المنهجية</h1>
          <span className="badge badge-primary mr-auto">{books.length}</span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          {books.map((book, i) => {
            const subj = subjects.find(s => s.id === book.subjectId);
            return (
              <div key={book.id} className="card overflow-hidden fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="h-36 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${subj?.color || '#8B5CF6'}20, ${subj?.color || '#8B5CF6'}10)` }}>
                  <BookOpen size={40} style={{ color: subj?.color || '#8B5CF6', opacity: 0.5 }} />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-bold line-clamp-2">{book.title}</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs text-muted">{book.fileSize}</span>
                    <span className="badge badge-primary text-[10px]">{subj?.name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted mt-1">
                    <Download size={11} />
                    <span>{book.downloads.toLocaleString('ar-EG')}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="btn-primary flex-1 text-[11px] py-1.5 px-2">تحميل</button>
                    <button className="btn-secondary text-[11px] py-1.5 px-2">عرض</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <BottomNav active="home" />
    </div>
  );
}
