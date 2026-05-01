'use client';

import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import type { OrderRecord } from '@/lib/types';

export default function RiderDashboardClient(): JSX.Element {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders', { cache: 'no-store' });

      if (!response.ok) {
        throw new Error('Failed to load orders');
      }

      const data = (await response.json()) as OrderRecord[];
      setOrders(data.filter((order) => order.status !== 'delivered'));
      setError('');
    } catch (fetchError: unknown) {
      setError(fetchError instanceof Error ? fetchError.message : 'Unable to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, status: 'out_for_delivery' | 'delivered') => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order');
      }

      await fetchOrders();
    } catch (updateError: unknown) {
      setError(updateError instanceof Error ? updateError.message : 'Unable to update order');
    }
  };

  if (loading) {
    return <p className="empty-state">Loading dispatch queue...</p>;
  }

  return (
    <section className="dashboard-shell">
      <div className="dashboard-heading">
        <div>
          <p className="eyebrow">Dispatch queue</p>
          <h1>Rider dashboard</h1>
        </div>
        <p>{orders.length} active deliveries to manage.</p>
      </div>

      {error ? <p className="status-banner status-error">{error}</p> : null}

      <div className="orders-list">
        {orders.map((order) => (
          <article key={order.id} className="card delivery-card">
            <div>
              <h3>{order.customerName}</h3>
              <p>{order.deliveryAddress}</p>
              <p>{order.customerEmail}</p>
            </div>
            <div className="delivery-meta">
              <strong>KES {order.total}</strong>
              <span className={`status-chip status-${order.status}`}>{order.status}</span>
            </div>
            <div className="action-row">
              <button type="button" onClick={() => updateStatus(order.id, 'out_for_delivery')}>
                Pick up
              </button>
              <button type="button" onClick={() => updateStatus(order.id, 'delivered')}>
                Mark delivered
              </button>
            </div>
          </article>
        ))}
        {orders.length === 0 ? <p className="empty-state">No active deliveries right now.</p> : null}
      </div>
    </section>
  );
}
