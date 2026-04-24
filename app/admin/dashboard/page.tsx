'use client';

import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import type { OrderRecord, OrderStatus } from '@/lib/types';

const STATUS_ACTIONS: OrderStatus[] = ['confirmed', 'delivered'];

export default function AdminDashboard(): JSX.Element {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    void fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');

      if (!response.ok) {
        throw new Error('Failed to load orders');
      }

      const data: unknown = await response.json();
      setOrders(Array.isArray(data) ? data : []);
      setError('');
    } catch (error: unknown) {
      console.error('Failed to fetch orders:', error);
      setError('Unable to load orders right now.');
    } finally {
      setLoading(false);
    }
  };

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
    } catch (error: unknown) {
      console.error('Failed to update order:', error);
      setError('Unable to update that order right now.');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <main className="container">
      <h1>Admin Dashboard</h1>
      {error ? <p>{error}</p> : null}
      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User ID</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.userId}</td>
                <td>KES {order.total}</td>
                <td>{order.status}</td>
                <td>
                  {STATUS_ACTIONS.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => updateOrderStatus(order.id, status)}
                    >
                      {status === 'confirmed' ? 'Confirm' : 'Mark Delivered'}
                    </button>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
