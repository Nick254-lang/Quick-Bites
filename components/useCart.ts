'use client';

import { useEffect, useMemo, useState } from 'react';
import type { CartItem, MenuItem } from '@/lib/types';

const CART_KEY = 'myrestaurant_cart';

const readCart = (): CartItem[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
};

const writeCart = (items: CartItem[]): void => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent('cart:updated', { detail: items }));
};

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(readCart());

    const syncCart = () => setItems(readCart());

    window.addEventListener('storage', syncCart);
    window.addEventListener('cart:updated', syncCart as EventListener);

    return () => {
      window.removeEventListener('storage', syncCart);
      window.removeEventListener('cart:updated', syncCart as EventListener);
    };
  }, []);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const count = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const addItem = (menuItem: MenuItem): void => {
    const currentItems = readCart();
    const existing = currentItems.find((item) => item.id === menuItem.id);
    const nextItems = existing
      ? currentItems.map((item) =>
          item.id === menuItem.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      : [
          ...currentItems,
          {
            id: menuItem.id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: 1,
          },
        ];

    writeCart(nextItems);
    setItems(nextItems);
  };

  const updateQuantity = (id: string, quantity: number): void => {
    const nextItems = readCart()
      .map((item) => (item.id === id ? { ...item, quantity } : item))
      .filter((item) => item.quantity > 0);

    writeCart(nextItems);
    setItems(nextItems);
  };

  const clearCart = (): void => {
    writeCart([]);
    setItems([]);
  };

  return {
    items,
    total,
    count,
    addItem,
    updateQuantity,
    clearCart,
  };
};
