import type { ReactNode } from 'react';
import AdminLoginGate from '@/components/admin/admin-login-gate';
import { getAdminSession } from '@/lib/admin-auth';
import { isDatabaseReachable } from '@/lib/database-health';

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getAdminSession();
  const databaseReady = await isDatabaseReachable();

  if (!session) {
    return <AdminLoginGate databaseReady={databaseReady} />;
  }

  return children;
}
