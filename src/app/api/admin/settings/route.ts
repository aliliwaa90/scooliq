import { NextResponse } from 'next/server';
import { badRequest, requireAdminApi } from '@/lib/admin-api';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request) {
  const auth = await requireAdminApi();

  if (auth.response) {
    return auth.response;
  }

  if (!prisma) {
    return badRequest('قاعدة البيانات غير مفعلة.', 500);
  }

  const body = await request.json().catch(() => null);

  if (!body) {
    return badRequest('بيانات الإعدادات غير صالحة.');
  }

  const siteName = typeof body.siteName === 'string' ? body.siteName.trim() : '';
  const siteDescription = typeof body.siteDescription === 'string' ? body.siteDescription.trim() : '';
  const telegramHandle = typeof body.telegramHandle === 'string' ? body.telegramHandle.trim() : '';
  const maintenanceMode = Boolean(body.maintenanceMode);
  const allowRegistration = body.allowRegistration !== false;

  if (!siteName || !siteDescription) {
    return badRequest('اسم المنصة والوصف مطلوبان.');
  }

  const settings = await prisma.siteSetting.upsert({
    where: {
      id: 'main',
    },
    create: {
      id: 'main',
      siteName,
      siteDescription,
      telegramHandle,
      maintenanceMode,
      allowRegistration,
    },
    update: {
      siteName,
      siteDescription,
      telegramHandle,
      maintenanceMode,
      allowRegistration,
    },
  });

  return NextResponse.json({ settings });
}
