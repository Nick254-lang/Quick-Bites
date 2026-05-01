import type { JSX } from 'react';
import Link from 'next/link';
import MenuCard from '@/components/MenuCard';

export default async function MenuPage(): Promise<JSX.Element> {
  const { listMenuItems } = await import('@/lib/db');
  const items = await listMenuItems();

  return (
    <main className="container page-shell">
      <section className="section-heading">
        <div>
          <p className="eyebrow">Menu</p>
          <h1>Built for cravings and conversion</h1>
          <p className="section-copy">
            Add items to your cart as you go, then head straight to checkout when you are ready.
          </p>
        </div>
        <Link href="/checkout" className="btn">
          Go to checkout
        </Link>
      </section>
      <MenuCard items={items} />
    </main>
  );
}
