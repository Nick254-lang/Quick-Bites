export const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'out_for_delivery',
  'delivered',
] as const;

export const USER_ROLES = ['customer', 'admin', 'rider'] as const;
export const MENU_CATEGORIES = [
  'signature',
  'grill',
  'bowls',
  'sides',
  'dessert',
  'drinks',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type UserRole = (typeof USER_ROLES)[number];
export type MenuCategory = (typeof MENU_CATEGORIES)[number];

export interface MenuItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  prepTime: string;
  imagePublicId: string;
  imageUrl: string;
  featured?: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface OrderRecord {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  deliveryAddress: string;
  notes?: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export interface OrderCreateInput {
  customerName: string;
  customerEmail: string;
  deliveryAddress: string;
  notes?: string;
  items: OrderItem[];
}

export interface OrderUpdateInput {
  status: OrderStatus;
}

export interface BookingRecord {
  id: string;
  name: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  notes?: string;
  createdAt: string;
}

export interface BookingCreateInput {
  name: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  notes?: string;
}

export interface ContactRecord {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface ContactCreateInput {
  name: string;
  email: string;
  message: string;
}

export interface UserRecord {
  id: string;
  firebaseUid: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface SessionUser {
  id: string;
  firebaseUid: string;
  name: string;
  email: string;
  role: UserRole;
}
