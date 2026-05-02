'use client';

import type { JSX } from 'react';
import { useMemo } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/useCart';
import { useMultiAuth } from '@/components/useMultiAuth';

const giftCards = [
  {
    id: 'gift-25',
    name: 'Gift Card - KES 25',
    price: 25,
    description: 'A sweet little treat for coffee or dessert.',
  },
  {
    id: 'gift-50',
    name: 'Gift Card - KES 50',
    price: 50,
    description: 'Perfect for a quick meal or snack.',
  },
  {
    id: 'gift-75',
    name: 'Gift Card - KES 75',
    price: 75,
    description: 'A generous gift for friends and family.',
  },
  {
    id: 'gift-100',
    name: 'Gift Card - KES 100',
    price: 100,
    description: 'Great for a full lunch or dinner special.',
  },
  {
    id: 'gift-150',
    name: 'Gift Card - KES 150',
    price: 150,
    description: 'A memorable gift with extra value.',
  },
  {
    id: 'gift-200',
    name: 'Gift Card - KES 200',
    price: 200,
    description: 'Treat someone to a premium meal experience.',
  },
];

export default function GiftCardsPage(): JSX.Element {
  const { currentUser, isLoading } = useMultiAuth();
  const { items, addItem } = useCart();

  const selectedGiftCards = useMemo(
    () => items.filter((item) => item.id.startsWith('gift-')),
    [items]
  );

  const giftCartTotal = useMemo(
    () => selectedGiftCards.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [selectedGiftCards]
  );

  const handleAddGiftCard = (id: string, name: string, price: number) => {
    addItem({ id, name, price, quantity: 1 });
  };

  if (isLoading) {
    return (
      <main className="container page-shell">
        <p>Loading gift card options…</p>
      </main>
    );
  }

  if (!currentUser) {
    return (
      <main className="container page-shell">
        <article className="card">
          <p className="eyebrow">Gift cards</p>
          <h1>Sign in to purchase a gift card</h1>
          <p className="section-copy">
            Gift cards are available to signed in customers only. Create an account or sign in to send a gift to someone special.
          </p>
          <Link href="/login" className="btn">
            Login
          </Link>
        </article>
      </main>
    );
  }

  return (
    <main className="container page-shell">
      <section className="section-stack">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Gift cards</p>
            <h1>Select a card value and add it to checkout</h1>
          </div>
          <Link href="/checkout" className="btn">
            Go to checkout
          </Link>
        </div>

        <div className="menu-grid">
          {giftCards.map((card) => (
            <article key={card.id} className="card menu-card">
              <div className="menu-card-body">
                <div className="menu-card-header">
                  <h3>{card.name}</h3>
                  <span>KES {card.price}</span>
                </div>
                <p>{card.description}</p>
                <button type="button" className="btn btn-secondary" onClick={() => handleAddGiftCard(card.id, card.name, card.price)}>
                  Select
                </button>
              </div>
            </article>
          ))}
        </div>

        <section className="section-stack">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Selected cards</p>
              <h2>Your gift card cart</h2>
            </div>
          </div>

          {selectedGiftCards.length === 0 ? (
            <div className="empty-box">
              <p>No gift cards selected yet. Tap a card to add it to your purchase.</p>
            </div>
          ) : (
            <div className="orders-list">
              {selectedGiftCards.map((item) => (
                <article key={item.id} className="card cart-row">
                  <div>
                    <h3>{item.name}</h3>
                    <p>KES {item.price} × {item.quantity}</p>
                  </div>
                  <strong>KES {item.price * item.quantity}</strong>
                </article>
              ))}
            </div>
          )}

          <div className="summary-row">
            <span>Gift card total</span>
            <strong>KES {giftCartTotal}</strong>
          </div>
          <p className="section-copy">
            Complete your gift card purchase on the checkout page where you can add recipient details and send the order to our admin.
          </p>
          <Link href="/checkout" className="btn" aria-disabled={selectedGiftCards.length === 0}>
            Checkout gift cards
          </Link>
        </section>
      </section>
    </main>
  );
}
