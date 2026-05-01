'use client';

import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import type { OrderRecord } from '@/lib/types';

export default function OrderHistoryClient(): JSX.Element {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders', { cache: 'no-store' });

        if (!response.ok) {
          throw new Error('Failed to load orders');
        }

        const data = (await response.json()) as OrderRecord[];
        setOrders(data);
      } catch (fetchError: unknown) {
        setError(fetchError instanceof Error ? fetchError.message : 'Unable to load orders');
      } finally {
        setLoading(false);
      }
    };

    void fetchOrders();
  }, []);

  if (loading) {
    return <p className="empty-state">Loading your orders...</p>;
  }

  if (error) {
    return <p className="status-banner status-error">{error}</p>;
  }

  return (
    <section className="dashboard-shell">
      <div className="dashboard-heading">
        <div>
          <p className="eyebrow">Account</p>
          <h1>Your orders</h1>
        </div>
        <p>{orders.length} orders tracked from this account.</p>
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <article key={order.id} className="card order-history-card">
            <div className="menu-card-header">
              <h3>Order #{order.id.slice(0, 8)}</h3>
              <span>KES {order.total}</span>
            </div>
            <p>{new Date(order.createdAt).toLocaleString()}</p>
            <p>{order.deliveryAddress}</p>
            <span className={`status-chip status-${order.status}`}>{order.status}</span>
          </article>
        ))}
        {orders.length === 0 ? <p className="empty-state">You have not placed an order yet.</p> : null}
      </div>
    </section>
  );
}
