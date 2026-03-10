import { NextResponse } from 'next/server';
import { badRequest, requireAdminApi } from '@/lib/admin-api';
import { syncSubjectStats } from '@/lib/admin-data';
import { prisma } from '@/lib/prisma';

const allowedTypes = new Set(['handout', 'book', 'summary']);

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
    return badRequest('بيانات الملف غير صالحة.');
  }

  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const fileUrl = typeof body.fileUrl === 'string' ? body.fileUrl.trim() : '';
  const fileSize = typeof body.fileSize === 'string' ? body.fileSize.trim() : '';
  const cover = typeof body.cover === 'string' ? body.cover.trim() : '';
  const subjectId = typeof body.subjectId === 'string' ? body.subjectId.trim() : '';
  const type = typeof body.type === 'string' ? body.type.trim() : '';
  const isFree = Boolean(body.isFree);
  const isActive = body.isActive !== false;

  if (!title || !fileUrl || !fileSize || !subjectId || !allowedTypes.has(type)) {
    return badRequest('يرجى تعبئة الحقول الأساسية للملف.');
  }

  const subject = await prisma.subject.findUnique({
    where: {
      id: subjectId,
    },
  });

  if (!subject) {
    return badRequest('المادة المختارة غير موجودة.', 404);
  }

  const handout = await prisma.handout.create({
    data: {
      title,
      fileUrl,
      fileSize,
      cover,
      subjectId,
      gradeId: subject.gradeId,
      type,
      isFree,
      isActive,
    },
  });

  await syncSubjectStats(subjectId);

  return NextResponse.json({ handout });
}
