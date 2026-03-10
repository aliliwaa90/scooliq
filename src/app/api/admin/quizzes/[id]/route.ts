import { NextResponse } from 'next/server';
import { badRequest, requireAdminApi } from '@/lib/admin-api';
import { syncSubjectStats } from '@/lib/admin-data';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminApi();

  if (auth.response) {
    return auth.response;
  }

  if (!prisma) {
    return badRequest('قاعدة البيانات غير مفعلة.', 500);
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const action = body?.action;

  const quiz = await prisma.quiz.findUnique({
    where: {
      id,
    },
  });

  if (!quiz) {
    return badRequest('الاختبار غير موجود.', 404);
  }

  if (action !== 'toggle-active') {
    return badRequest('الإجراء غير مدعوم.');
  }

  const updated = await prisma.quiz.update({
    where: {
      id,
    },
    data: {
      isActive: !quiz.isActive,
    },
  });

  await syncSubjectStats(quiz.subjectId);

  return NextResponse.json({ quiz: updated });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminApi();

  if (auth.response) {
    return auth.response;
  }

  if (!prisma) {
    return badRequest('قاعدة البيانات غير مفعلة.', 500);
  }

  const { id } = await params;
  const quiz = await prisma.quiz.findUnique({
    where: {
      id,
    },
  });

  if (!quiz) {
    return badRequest('الاختبار غير موجود.', 404);
  }

  await prisma.quiz.delete({
    where: {
      id,
    },
  });

  await syncSubjectStats(quiz.subjectId);

  return NextResponse.json({ ok: true });
}
