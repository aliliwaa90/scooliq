import { NextResponse } from 'next/server';
import { badRequest, requireAdminApi } from '@/lib/admin-api';
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
    return badRequest('بيانات البانر غير صالحة.');
  }

  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const subtitle = typeof body.subtitle === 'string' ? body.subtitle.trim() : '';
  const imageUrl = typeof body.imageUrl === 'string' ? body.imageUrl.trim() : '';
  const linkUrl = typeof body.linkUrl === 'string' ? body.linkUrl.trim() : '';
  const sortOrder = Number(body.sortOrder);
  const isActive = body.isActive !== false;

  if (!title || !subtitle || !linkUrl) {
    return badRequest('يرجى تعبئة عنوان البانر ووصفه والرابط.');
  }

  const banner = await prisma.banner.create({
    data: {
      title,
      subtitle,
      imageUrl,
      linkUrl,
      sortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder,
      isActive,
    },
  });

  return NextResponse.json({ banner });
}
