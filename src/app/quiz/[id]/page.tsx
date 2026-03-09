'use client';

import { useState, useEffect } from 'react';
import { useCatalog } from '@/components/catalog-provider';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowRight, Clock, CheckCircle, XCircle, RotateCcw, Trophy, ChevronLeft } from 'lucide-react';

type QuizState = 'intro' | 'playing' | 'result';

export default function QuizPage() {
  const { quizzes, subjects } = useCatalog();
  const params = useParams();
  const quizId = params.id as string;
  const quiz = quizzes.find(q => q.id === quizId);
  const subject = quiz ? subjects.find(s => s.id === quiz.subjectId) : null;

  const [state, setState] = useState<QuizState>('intro');
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => (
    quiz ? new Array(quiz.questions.length).fill(null) : []
  ));
  const [timeLeft, setTimeLeft] = useState(() => (quiz ? quiz.duration * 60 : 0));
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    if (state !== 'playing' || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setState('result');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [state, timeLeft]);

  if (!quiz) {
    return <div className="min-h-screen flex items-center justify-center"><p>الاختبار غير موجود</p></div>;
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const score = answers.reduce((acc: number, ans, i) => {
    if (ans === quiz.questions[i]?.correct) return acc + 1;
    return acc;
  }, 0);

  const percentage = Math.round((score / quiz.questions.length) * 100);
  const question = quiz.questions[current];

  const selectAnswer = (optIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[current] = optIndex;
    setAnswers(newAnswers);
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    setShowExplanation(false);
    if (current < quiz.questions.length - 1) {
      setCurrent(current + 1);
    } else {
      setState('result');
    }
  };

  const restart = () => {
    setState('intro');
    setCurrent(0);
    setAnswers(new Array(quiz.questions.length).fill(null));
    setTimeLeft(quiz.duration * 60);
    setShowExplanation(false);
  };

  // ===== INTRO =====
  if (state === 'intro') {
    return (
      <div className="min-h-screen pb-8">
        <header className="sticky top-0 z-40 glass">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
            <Link href={`/subject/${quiz.subjectId}`} className="w-9 h-9 rounded-full surface-elevated flex items-center justify-center">
              <ArrowRight size={18} />
            </Link>
            <h1 className="font-bold text-lg">الاختبار</h1>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 py-4">
          <div className="card p-6 text-center fade-in">
            <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-4xl mb-4" style={{ background: subject ? `${subject.color}15` : '#f0f0f0' }}>
              {subject?.icon || '📝'}
            </div>
            <h2 className="text-xl font-bold mb-2">{quiz.title}</h2>
            <p className="text-sm text-muted">{subject?.name} • {quiz.chapter}</p>

            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="surface-elevated rounded-xl p-3">
                <p className="font-bold text-lg text-primary">{quiz.questions.length}</p>
                <p className="text-xs text-muted">سؤال</p>
              </div>
              <div className="surface-elevated rounded-xl p-3">
                <p className="font-bold text-lg text-accent">{quiz.duration}</p>
                <p className="text-xs text-muted">دقيقة</p>
              </div>
              <div className="surface-elevated rounded-xl p-3">
                <p className="font-bold text-lg text-success">{quiz.attempts.toLocaleString('ar-EG')}</p>
                <p className="text-xs text-muted">محاولة</p>
              </div>
            </div>

            <button
              onClick={() => setState('playing')}
              className="btn-primary w-full mt-6 py-3.5 text-base"
            >
              ابدأ الاختبار
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ===== RESULT =====
  if (state === 'result') {
    return (
      <div className="min-h-screen pb-8">
        <header className="sticky top-0 z-40 glass">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
            <Link href={`/subject/${quiz.subjectId}`} className="w-9 h-9 rounded-full surface-elevated flex items-center justify-center">
              <ArrowRight size={18} />
            </Link>
            <h1 className="font-bold text-lg">النتيجة</h1>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 py-4">
          <div className="card p-6 text-center fade-in">
            <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-4 ${percentage >= 60 ? 'bg-success/10' : 'bg-error/10'}`}>
              <Trophy size={40} className={percentage >= 60 ? 'text-success' : 'text-error'} />
            </div>
            <h2 className="text-2xl font-bold mb-1">
              {percentage >= 90 ? 'ممتاز! 🎉' : percentage >= 60 ? 'جيد! 👏' : 'حاول مرة أخرى 💪'}
            </h2>
            <p className="text-sm text-muted">{quiz.title}</p>

            <div className="mt-6 relative w-32 h-32 mx-auto">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" strokeWidth="8" className="stroke-current text-gray-200 dark:text-gray-700" />
                <circle cx="60" cy="60" r="54" fill="none" strokeWidth="8" strokeDasharray={`${percentage * 3.39} 339.292`} strokeLinecap="round" className={`stroke-current ${percentage >= 60 ? 'text-success' : 'text-error'}`} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold">{percentage}%</span>
              </div>
            </div>

            <p className="text-sm text-muted mt-4">{score} من {quiz.questions.length} إجابة صحيحة</p>

            <div className="flex gap-3 mt-6">
              <button onClick={restart} className="btn-secondary flex-1">
                <RotateCcw size={16} />
                إعادة
              </button>
              <Link href={`/subject/${quiz.subjectId}`} className="btn-primary flex-1">
                رجوع للمادة
              </Link>
            </div>
          </div>

          {/* Review */}
          <div className="mt-6 space-y-3">
            <h3 className="font-bold text-base">مراجعة الإجابات</h3>
            {quiz.questions.map((q, i) => {
              const isCorrect = answers[i] === q.correct;
              return (
                <div key={q.id} className="card p-4 fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="flex items-start gap-2">
                    {isCorrect ? <CheckCircle size={18} className="text-success mt-0.5 flex-shrink-0" /> : <XCircle size={18} className="text-error mt-0.5 flex-shrink-0" />}
                    <div>
                      <p className="text-sm font-semibold">{q.text}</p>
                      <p className="text-xs mt-2">
                        <span className="text-muted">إجابتك: </span>
                        <span className={isCorrect ? 'text-success font-semibold' : 'text-error font-semibold'}>
                          {answers[i] !== null ? q.options[answers[i]!] : 'لم تُجب'}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p className="text-xs mt-1">
                          <span className="text-muted">الإجابة الصحيحة: </span>
                          <span className="text-success font-semibold">{q.options[q.correct]}</span>
                        </p>
                      )}
                      <p className="text-xs text-muted mt-2 surface-elevated p-2 rounded-lg">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  // ===== PLAYING =====
  return (
    <div className="min-h-screen pb-8">
      {/* Timer Bar */}
      <div className="sticky top-0 z-40 glass">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">السؤال {current + 1} من {quiz.questions.length}</span>
            <span className={`flex items-center gap-1 text-sm font-bold ${timeLeft < 60 ? 'text-error' : 'text-primary'}`}>
              <Clock size={14} />
              {formatTime(timeLeft)}
            </span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${((current + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <main className="max-w-lg mx-auto px-4 py-4">
        <div className="card p-5 fade-in">
          <p className="font-bold text-base mb-4">{question.text}</p>

          <div className="space-y-2.5">
            {question.options.map((opt, optIdx) => {
              const isSelected = answers[current] === optIdx;
              const isCorrect = optIdx === question.correct;
              const showResult = showExplanation;

              let classes = 'p-3.5 rounded-xl border-2 text-sm font-semibold cursor-pointer transition-all flex items-center gap-3';
              if (showResult && isCorrect) {
                classes += ' border-success bg-success/10 text-success';
              } else if (showResult && isSelected && !isCorrect) {
                classes += ' border-error bg-error/10 text-error';
              } else if (isSelected) {
                classes += ' border-primary bg-primary/10 text-primary';
              } else {
                classes += ' border-theme hover:border-primary/50';
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => !showExplanation && selectAnswer(optIdx)}
                  disabled={showExplanation}
                  className={classes}
                >
                  <span className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ borderColor: 'inherit' }}>
                    {String.fromCharCode(1571 + optIdx)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className="mt-4 p-3 rounded-xl surface-elevated text-sm fade-in">
              <p className="font-semibold mb-1">التوضيح:</p>
              <p className="text-muted">{question.explanation}</p>
            </div>
          )}

          {showExplanation && (
            <button onClick={nextQuestion} className="btn-primary w-full mt-4">
              {current < quiz.questions.length - 1 ? 'السؤال التالي' : 'عرض النتيجة'}
              <ChevronLeft size={16} />
            </button>
          )}
        </div>

        {/* Question dots */}
        <div className="flex justify-center gap-1.5 mt-4 flex-wrap">
          {quiz.questions.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all ${
                i === current ? 'bg-primary scale-125' :
                answers[i] !== null ? (answers[i] === quiz.questions[i].correct ? 'bg-success' : 'bg-error') :
                'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
