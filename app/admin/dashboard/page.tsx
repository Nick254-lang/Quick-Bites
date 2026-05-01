import type { JSX } from 'react';
import AdminDashboardClient from '@/components/AdminDashboardClient';
import { requireRole } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage(): Promise<JSX.Element> {
  await requireRole('admin');

  return (
    <main className="container page-shell">
      <AdminDashboardClient />
    </main>
  );
}
