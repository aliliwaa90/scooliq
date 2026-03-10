import { getAdminUsers } from '@/lib/admin-data';
import AdminUsersClient from './users-client';

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  return <AdminUsersClient initialUsers={users} />;
}
