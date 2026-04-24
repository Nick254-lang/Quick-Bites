'use client';

import type { JSX } from 'react';

interface MenuItem {
  id: number;
  name: string;
  price: number;
}

const menuItems: MenuItem[] = [
  { id: 1, name: 'Burger', price: 500 },
  { id: 2, name: 'Pizza', price: 1200 },
  { id: 3, name: 'Fries', price: 300 },
];

export default function MenuCard(): JSX.Element {
  const handleAddToCart = (item: MenuItem) => {
    console.log('Added to cart:', item);
    // TODO: Implement cart functionality
  };

  return (
    <div id="menu" className="menu-grid">
      {menuItems.map((item) => (
        <div key={item.id} className="card">
          <h3>{item.name}</h3>
          <p>KES {item.price}</p>
          <button type="button" onClick={() => handleAddToCart(item)}>
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}
