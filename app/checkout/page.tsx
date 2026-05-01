'use client';

import type { FormEvent, JSX } from 'react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/useCart';
import type { SessionUser } from '@/lib/types';

export default function CheckoutPage(): JSX.Element {
  const router = useRouter();
  const { items, total, updateQuantity, clearCart } = useCart();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const response = await fetch('/api/auth/me', { cache: 'no-store' });
      const data = (await response.json()) as { user: SessionUser | null };

      if (data.user) {
        setUser(data.user);
        setName(data.user.name);
        setEmail(data.user.email);
      }
    };

    void loadUser();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (items.length === 0) {
      setStatus('Your cart is empty.');
      return;
    }

    setSubmitting(true);
    setStatus('');

    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: name,
        customerEmail: email,
        deliveryAddress,
        notes,
        items: items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      }),
    });

    const data = (await response.json()) as { id?: string; error?: string };

    if (!response.ok) {
      setSubmitting(false);
      setStatus(data.error ?? 'Unable to place your order.');

      if (response.status === 401) {
        router.push('/login');
      }
      return;
    }

    clearCart();
    router.push('/orders');
  };

  return (
    <main className="container page-shell">
      <section className="checkout-grid">
        <div>
          <p className="eyebrow">Secure checkout</p>
          <h1>Review your order</h1>
          <p className="section-copy">
            Sign in before checkout. Demo accounts are listed on the login page for admin and rider access.
          </p>

          {items.length === 0 ? (
            <div className="empty-box">
              <p>Your cart is empty.</p>
              <Link href="/menu" className="btn">
                Browse menu
              </Link>
            </div>
          ) : (
            <div className="orders-list">
              {items.map((item) => (
                <article key={item.id} className="card cart-row">
                  <div>
                    <h3>{item.name}</h3>
                    <p>KES {item.price} each</p>
                  </div>
                  <div className="quantity-row">
                    <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      +
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <aside className="checkout-panel card">
          <h2>Delivery details</h2>
          {!user ? <p className="section-copy">You will be redirected to log in when you place the order.</p> : null}
          <form onSubmit={handleSubmit}>
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Full name" required />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              required
            />
            <textarea
              value={deliveryAddress}
              onChange={(event) => setDeliveryAddress(event.target.value)}
              placeholder="Delivery address"
              rows={4}
              required
            />
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Add order notes"
              rows={3}
            />
            <div className="summary-row">
              <span>Total</span>
              <strong>KES {total}</strong>
            </div>
            {status ? <p className="status-banner status-error">{status}</p> : null}
            <button type="submit" className="btn" disabled={submitting || items.length === 0}>
              {submitting ? 'Placing order...' : 'Place order'}
            </button>
          </form>
        </aside>
      </section>
    </main>
  );
}
