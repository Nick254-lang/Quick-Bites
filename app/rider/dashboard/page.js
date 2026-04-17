'use client';

import { useEffect, useState } from 'react';

export default function RiderDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      setOrders(data.filter(order => order.status !== 'delivered'));
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const pickupOrder = async (orderId) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'out_for_delivery' }),
      });
      fetchOrders();
    } catch (error) {
      console.error('Failed to pickup order:', error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <main className="container">
      <h1>Rider Dashboard</h1>
      <p>Available Orders: {orders.length}</p>
      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="card">
            <h3>Order #{order.id}</h3>
            <p>Total: KES {order.total}</p>
            <p>Status: {order.status}</p>
            <button onClick={() => pickupOrder(order.id)}>
              Pickup Order
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
