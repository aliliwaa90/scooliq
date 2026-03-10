import { NextResponse } from 'next/server';
import { badRequest, requireAdminApi } from '@/lib/admin-api';
import { prisma } from '@/lib/prisma';

const allowedTypes = new Set(['content', 'quiz', 'announcement', 'review']);

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
    return badRequest('بيانات الإشعار غير صالحة.');
  }

  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  const type = typeof body.type === 'string' ? body.type.trim() : '';
  const audience = typeof body.audience === 'string' ? body.audience.trim() : 'all';

  if (!title || !message || !allowedTypes.has(type)) {
    return badRequest('يرجى تعبئة عنوان الإشعار ونصه ونوعه.');
  }

  const notification = await prisma.notification.create({
    data: {
      title,
      message,
      type,
      audience,
    },
  });

  return NextResponse.json({ notification });
}
