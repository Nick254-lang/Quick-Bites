import type { JSX } from 'react';
import RiderDashboardClient from '@/components/RiderDashboardClient';
import { requireRole } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function RiderDashboardPage(): Promise<JSX.Element> {
  await requireRole('rider');

  return (
    <main className="container page-shell">
      <RiderDashboardClient />
    </main>
  );
}
