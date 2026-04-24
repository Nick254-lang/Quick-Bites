export const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'out_for_delivery',
  'delivered',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface OrderRecord {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt?: Date | string | null;
}

export interface OrderCreateInput {
  userId: string;
  items: OrderItem[];
  total: number;
}

export interface OrderUpdateInput {
  status: OrderStatus;
}
