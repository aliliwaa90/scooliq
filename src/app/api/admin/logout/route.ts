import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  ADMIN_SESSION_COOKIE,
  destroyAdminSession,
  getClearedAdminSessionCookie,
} from '@/lib/admin-auth';

export async function POST() {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  await destroyAdminSession(rawToken);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(getClearedAdminSessionCookie());
  return response;
}
