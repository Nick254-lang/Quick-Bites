'use client';

import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import type { OrderRecord, OrderStatus } from '@/lib/types';

const STATUS_ACTIONS: OrderStatus[] = ['confirmed', 'out_for_delivery', 'delivered'];

export default function AdminDashboardClient(): JSX.Element {
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
      setOrders(data);
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

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
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
    return <p className="empty-state">Loading orders...</p>;
  }

  return (
    <section className="dashboard-shell">
      <div className="dashboard-heading">
        <div>
          <p className="eyebrow">Operations overview</p>
          <h1>Admin dashboard</h1>
        </div>
        <p>{orders.length} live orders in the pipeline.</p>
      </div>

      {error ? <p className="status-banner status-error">{error}</p> : null}

      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Address</th>
              <th>Total</th>
              <th>Status</th>
              <th>Type</th>
              <th>Items</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const isGiftCardOrder = order.items.some((item) => item.name.startsWith('Gift Card'));
              return (
                <tr key={order.id}>
                  <td>
                    <strong>{order.customerName}</strong>
                    <span>{order.customerEmail}</span>
                  </td>
                  <td>{order.deliveryAddress}</td>
                  <td>KES {order.total}</td>
                  <td>
                    <span className={`status-chip status-${order.status}`}>{order.status}</span>
                  </td>
                  <td>
                    <span className={`status-chip ${isGiftCardOrder ? 'status-confirmed' : 'status-pending'}`}>
                      {isGiftCardOrder ? 'Gift Card' : 'Food'}
                    </span>
                  </td>
                  <td>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                  <td className="action-row">
                    {STATUS_ACTIONS.map((status) => (
                      <button
                        key={status}
                        type="button"
                        disabled={order.status === status}
                        onClick={() => updateOrderStatus(order.id, status)}
                      >
                        {status.replaceAll('_', ' ')}
                      </button>
                    ))}
                  </td>
                </tr>
              );
            })}
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-cell">
                  No orders yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
