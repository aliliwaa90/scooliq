import { NextResponse } from 'next/server';
import { badRequest, requireAdminApi } from '@/lib/admin-api';
import { syncSubjectStats } from '@/lib/admin-data';
import type { Question } from '@/lib/data';
import type { Prisma } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';

function parseQuestions(input: unknown): Question[] | null {
  if (!Array.isArray(input) || input.length === 0) {
    return null;
  }

  const questions = input.map((question, index) => {
    const item = question as Record<string, unknown>;
    const text = typeof item.text === 'string' ? item.text.trim() : '';
    const type = item.type === 'truefalse' ? 'truefalse' : 'mcq';
    const explanation = typeof item.explanation === 'string' ? item.explanation.trim() : '';
    const options = Array.isArray(item.options)
      ? item.options
          .map((option) => (typeof option === 'string' ? option.trim() : ''))
          .filter(Boolean)
      : [];
    const correct = Number(item.correct);

    if (!text || options.length < 2 || Number.isNaN(correct) || correct < 0 || correct >= options.length) {
      return null;
    }

    return {
      id: typeof item.id === 'string' && item.id ? item.id : `q-${index + 1}`,
      text,
      type,
      options,
      correct,
      explanation,
    } satisfies Question;
  });

  if (questions.some((question) => question === null)) {
    return null;
  }

  return questions as Question[];
}

export async function POST(request: Request) {
  const auth = await requireAdminApi();

  if (auth.response) {
    return auth.response;
  }

  if (!prisma) {
    return badRequest('قاعدة البيانات غير مفعلة.', 500);
  }

  const body = await request.json().catch(() => null);

  if (!body) {
    return badRequest('بيانات الاختبار غير صالحة.');
  }

  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const subjectId = typeof body.subjectId === 'string' ? body.subjectId.trim() : '';
  const chapter = typeof body.chapter === 'string' ? body.chapter.trim() : '';
  const duration = Number(body.duration);
  const isActive = body.isActive !== false;
  const questions = parseQuestions(body.questions);

  if (!title || !subjectId || !chapter || Number.isNaN(duration) || duration <= 0 || !questions) {
    return badRequest('يرجى تعبئة بيانات الاختبار والأسئلة بشكل صحيح.');
  }

  const subject = await prisma.subject.findUnique({
    where: {
      id: subjectId,
    },
  });

  if (!subject) {
    return badRequest('المادة المختارة غير موجودة.', 404);
  }

  const quiz = await prisma.quiz.create({
    data: {
      title,
      subjectId,
      gradeId: subject.gradeId,
      chapter,
      duration,
      questionCount: questions.length,
      questions: questions as unknown as Prisma.InputJsonValue,
      isActive,
    },
  });

  await syncSubjectStats(subjectId);

  return NextResponse.json({ quiz });
}
