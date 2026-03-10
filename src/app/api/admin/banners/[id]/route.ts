import { NextResponse } from 'next/server';
import { badRequest, requireAdminApi } from '@/lib/admin-api';
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

  const banner = await prisma.banner.findUnique({
    where: {
      id,
    },
  });

  if (!banner) {
    return badRequest('البانر غير موجود.', 404);
  }

  if (action !== 'toggle-active') {
    return badRequest('الإجراء غير مدعوم.');
  }

  const updated = await prisma.banner.update({
    where: {
      id,
    },
    data: {
      isActive: !banner.isActive,
    },
  });

  return NextResponse.json({ banner: updated });
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

  await prisma.banner.delete({
    where: {
      id,
    },
  });

  return NextResponse.json({ ok: true });
}
