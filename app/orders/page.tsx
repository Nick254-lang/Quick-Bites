import type { JSX } from 'react';
import OrderHistoryClient from '@/components/OrderHistoryClient';
import { requireSessionUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function OrdersPage(): Promise<JSX.Element> {
  await requireSessionUser();

  return (
    <main className="container page-shell">
      <OrderHistoryClient />
    </main>
  );
}
