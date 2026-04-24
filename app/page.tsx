'use client';

import Link from 'next/link';

export default function Home(): JSX.Element {
  return (
    <main>
      <section className="hero fade-in">
        <h1>Delicious Food, Delivered Fast</h1>
        <p>Order your favorite meals anytime 🍕</p>
        <Link href="/menu" className="btn">Browse Menu</Link>
      </section>
    </main>
  );
}
