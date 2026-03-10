import { NextResponse } from 'next/server';
import { badRequest, requireAdminApi } from '@/lib/admin-api';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminApi();

  if (auth.response || !auth.session) {
    return auth.response;
  }

  if (!prisma) {
    return badRequest('قاعدة البيانات غير مفعلة.', 500);
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const action = body?.action;

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    return badRequest('المستخدم غير موجود.', 404);
  }

  if (action === 'toggle-role') {
    const nextRole = user.role === 'admin' ? 'student' : 'admin';

    if (user.id === auth.session.user.id && nextRole !== 'admin') {
      return badRequest('لا يمكن إزالة صلاحيات المدير الحالي من نفسه.');
    }

    const updated = await prisma.user.update({
      where: {
        id,
      },
      data: {
        role: nextRole,
      },
    });

    return NextResponse.json({ user: updated });
  }

  if (action === 'toggle-active') {
    const nextActive = !user.isActive;

    if (user.id === auth.session.user.id && !nextActive) {
      return badRequest('لا يمكن تعطيل حساب المدير الحالي أثناء استخدامه.');
    }

    const updated = await prisma.user.update({
      where: {
        id,
      },
      data: {
        isActive: nextActive,
      },
    });

    return NextResponse.json({ user: updated });
  }

  return badRequest('الإجراء غير مدعوم.');
}
