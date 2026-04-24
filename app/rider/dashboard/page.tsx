'use client';

import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import type { OrderRecord } from '@/lib/types';

export default function RiderDashboard(): JSX.Element {
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
      setOrders(
        Array.isArray(data)
          ? data.filter(
              (order): order is OrderRecord =>
                typeof order === 'object' &&
                order !== null &&
                'id' in order &&
                'status' in order &&
                (order as OrderRecord).status !== 'delivered'
            )
          : []
      );
      setError('');
    } catch (error: unknown) {
      console.error('Failed to fetch orders:', error);
      setError('Unable to load rider orders right now.');
    } finally {
      setLoading(false);
    }
  };

  const pickupOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'out_for_delivery' }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order');
      }

      await fetchOrders();
    } catch (error: unknown) {
      console.error('Failed to pickup order:', error);
      setError('Unable to update that order right now.');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <main className="container">
      <h1>Rider Dashboard</h1>
      {error ? <p>{error}</p> : null}
      <p>Available Orders: {orders.length}</p>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="card">
            <h3>Order #{order.id}</h3>
            <p>Total: KES {order.total}</p>
            <p>Status: {order.status}</p>
            <button type="button" onClick={() => pickupOrder(order.id)}>
              Pickup Order
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
