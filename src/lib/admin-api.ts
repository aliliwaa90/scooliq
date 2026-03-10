import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';

export async function requireAdminApi() {
  const session = await getAdminSession();

  if (!session) {
    return {
      session: null,
      response: NextResponse.json(
        { message: 'يجب تسجيل الدخول كمدير أولاً.' },
        { status: 401 },
      ),
    };
  }

  return {
    session,
    response: null,
  };
}

export function badRequest(message: string, status = 400) {
  return NextResponse.json({ message }, { status });
}
