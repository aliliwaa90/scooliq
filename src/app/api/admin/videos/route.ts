import { NextResponse } from 'next/server';
import { badRequest, requireAdminApi } from '@/lib/admin-api';
import { syncSubjectStats } from '@/lib/admin-data';
import { prisma } from '@/lib/prisma';

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
    return badRequest('بيانات الفيديو غير صالحة.');
  }

  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const description = typeof body.description === 'string' ? body.description.trim() : '';
  const thumbnail = typeof body.thumbnail === 'string' ? body.thumbnail.trim() : '';
  const url = typeof body.url === 'string' ? body.url.trim() : '';
  const teacher = typeof body.teacher === 'string' ? body.teacher.trim() : '';
  const duration = typeof body.duration === 'string' ? body.duration.trim() : '';
  const subjectId = typeof body.subjectId === 'string' ? body.subjectId.trim() : '';
  const chapter = typeof body.chapter === 'string' ? body.chapter.trim() : '';
  const lesson = typeof body.lesson === 'string' ? body.lesson.trim() : '';
  const isFree = Boolean(body.isFree);
  const isActive = body.isActive !== false;

  if (!title || !url || !teacher || !duration || !subjectId || !chapter || !lesson) {
    return badRequest('يرجى تعبئة الحقول الأساسية للفيديو.');
  }

  const subject = await prisma.subject.findUnique({
    where: {
      id: subjectId,
    },
  });

  if (!subject) {
    return badRequest('المادة المختارة غير موجودة.', 404);
  }

  const video = await prisma.video.create({
    data: {
      title,
      description,
      thumbnail,
      url,
      teacher,
      duration,
      subjectId,
      gradeId: subject.gradeId,
      chapter,
      lesson,
      isFree,
      isActive,
    },
  });

  await syncSubjectStats(subjectId);

  return NextResponse.json({ video });
}
