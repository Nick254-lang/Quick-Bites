'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import type { MenuItem } from '@/lib/types';
import { useCart } from '@/components/useCart';

const categories: Array<MenuItem['category'] | 'all'> = [
  'all',
  'signature',
  'grill',
  'bowls',
  'sides',
  'dessert',
  'drinks',
];

interface MenuCardProps {
  items: MenuItem[];
}

export default function MenuCard({ items }: MenuCardProps): JSX.Element {
  const [category, setCategory] = useState<(typeof categories)[number]>('all');
  const [message, setMessage] = useState('');
  const { addItem } = useCart();

  const filteredItems =
    category === 'all'
      ? items
      : items.filter((item) => item.category === category);

  const handleAddToCart = (item: MenuItem) => {
    addItem(item);
    setMessage(`${item.name} added to cart.`);
    window.setTimeout(() => setMessage(''), 2000);
  };

  return (
    <section className="menu-section">
      <div className="menu-toolbar">
        <div>
          <p className="eyebrow">Fresh from the kitchen</p>
          <h2>Designed for delivery and dine-in</h2>
        </div>
        <div className="pill-row" aria-label="Menu filters">
          {categories.map((entry) => (
            <button
              key={entry}
              type="button"
              className={`pill ${category === entry ? 'pill-active' : ''}`}
              onClick={() => setCategory(entry)}
            >
              {entry === 'all' ? 'All' : entry.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {message ? <p className="status-banner">{message}</p> : null}

      <div id="menu" className="menu-grid">
        {filteredItems.map((item, index) => (
          <article key={item.id} className="card menu-card">
            <Image
              src={item.imageUrl}
              alt={item.name}
              width={800}
              height={600}
              className="menu-card-image"
              sizes="(max-width: 760px) 100vw, (max-width: 1200px) 50vw, 33vw"
              preload={index < 2}
            />
            <div className="menu-card-body">
              <div className="menu-card-header">
                <h3>{item.name}</h3>
                <span>KES {item.price}</span>
              </div>
              <p>{item.description}</p>
              <div className="menu-card-footer">
                <small>{item.prepTime}</small>
                <button type="button" onClick={() => handleAddToCart(item)}>
                  Add to cart
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
