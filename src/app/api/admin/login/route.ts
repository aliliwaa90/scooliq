import { NextResponse } from 'next/server';
import {
  authenticateAdmin,
  getAdminSessionCookie,
} from '@/lib/admin-auth';
import { badRequest } from '@/lib/admin-api';
import { isDatabaseReachable } from '@/lib/database-health';

export async function POST(request: Request) {
  if (!(await isDatabaseReachable())) {
    return badRequest('تعذر الاتصال بقاعدة البيانات الحالية. تأكد من روابط Supabase أولاً.', 503);
  }

  const body = await request.json().catch(() => null);

  if (!body) {
    return badRequest('تعذر قراءة بيانات تسجيل الدخول.');
  }

  const username = typeof body.username === 'string' ? body.username.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!username || !password) {
    return badRequest('المعرف وكلمة السر مطلوبان.');
  }

  const auth = await authenticateAdmin(username, password);

  if (!auth) {
    return badRequest('بيانات الدخول غير صحيحة أو الحساب غير مفعل.', 401);
  }

  const response = NextResponse.json({
    user: auth.user,
  });

  response.cookies.set(getAdminSessionCookie(auth.token, auth.expiresAt));

  return response;
}
