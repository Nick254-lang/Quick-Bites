import type { JSX } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default async function Home(): Promise<JSX.Element> {
  const { listFeaturedMenuItems } = await import('@/lib/db');
  const featuredMenuItems = await listFeaturedMenuItems();

  return (
    <main>
      <section className="hero">
        <div className="hero-copy fade-in">
          <p className="eyebrow">Standalone restaurant operations</p>
          <h1>Delivery, dine-in, and dispatch in one polished app.</h1>
          <p className="section-copy">
            Run customer ordering, table reservations, and role-based staff workflows without wiring extra services just to get started.
          </p>
          <div className="hero-actions">
            <Link href="/menu" className="btn">
              Order now
            </Link>
            <Link href="/booking" className="btn btn-secondary">
              Reserve a table
            </Link>
          </div>
        </div>

        <div className="hero-panel card fade-in">
          <div className="stats-grid">
            <div>
              <strong>12</strong>
              <span>chef-curated dishes</span>
            </div>
            <div>
              <strong>15 min</strong>
              <span>average dispatch prep</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>ordering workflow ready</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container section-stack">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Featured menu</p>
            <h2>Fast favorites that travel well</h2>
          </div>
          <Link href="/menu">See full menu</Link>
        </div>

        <div className="menu-grid">
          {featuredMenuItems.map((item, index) => (
            <article key={item.id} className="card menu-card">
              <Image
                src={item.imageUrl}
                alt={item.name}
                width={800}
                height={600}
                className="menu-card-image"
                sizes="(max-width: 760px) 100vw, (max-width: 1200px) 50vw, 33vw"
                preload={index === 0}
              />
              <div className="menu-card-body">
                <div className="menu-card-header">
                  <h3>{item.name}</h3>
                  <span>KES {item.price}</span>
                </div>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
