import {
  ORDER_STATUSES,
  USER_ROLES,
  type BookingCreateInput,
  type ContactCreateInput,
  type OrderCreateInput,
  type OrderItem,
  type OrderStatus,
  type UserRole,
} from '@/lib/types';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isNonEmptyString = (value: unknown, minLength = 1): value is string =>
  typeof value === 'string' && value.trim().length >= minLength;

export const isEmail = (value: unknown): value is string =>
  typeof value === 'string' && emailPattern.test(value.trim());

export const isOrderItem = (value: unknown): value is OrderItem => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const item = value as Partial<OrderItem>;
  return (
    isNonEmptyString(item.name) &&
    typeof item.quantity === 'number' &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0 &&
    typeof item.price === 'number' &&
    item.price > 0
  );
};

export const parseOrderCreateInput = (value: unknown): OrderCreateInput | null => {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const input = value as Partial<OrderCreateInput>;

  if (
    !isNonEmptyString(input.customerName, 2) ||
    !isEmail(input.customerEmail) ||
    !isNonEmptyString(input.deliveryAddress, 8) ||
    !Array.isArray(input.items) ||
    input.items.length === 0 ||
    !input.items.every(isOrderItem)
  ) {
    return null;
  }

  return {
    customerName: input.customerName.trim(),
    customerEmail: input.customerEmail.trim().toLowerCase(),
    deliveryAddress: input.deliveryAddress.trim(),
    notes: typeof input.notes === 'string' ? input.notes.trim() : '',
    items: input.items,
  };
};

export const parseBookingInput = (value: unknown): BookingCreateInput | null => {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const input = value as Partial<BookingCreateInput>;

  if (
    !isNonEmptyString(input.name, 2) ||
    !isEmail(input.email) ||
    !isNonEmptyString(input.date) ||
    !isNonEmptyString(input.time) ||
    typeof input.guests !== 'number' ||
    !Number.isInteger(input.guests) ||
    input.guests < 1 ||
    input.guests > 20
  ) {
    return null;
  }

  return {
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    date: input.date,
    time: input.time,
    guests: input.guests,
    notes: typeof input.notes === 'string' ? input.notes.trim() : '',
  };
};

export const parseContactInput = (value: unknown): ContactCreateInput | null => {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const input = value as Partial<ContactCreateInput>;

  if (
    !isNonEmptyString(input.name, 2) ||
    !isEmail(input.email) ||
    !isNonEmptyString(input.message, 10)
  ) {
    return null;
  }

  return {
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    message: input.message.trim(),
  };
};

export const parseOrderStatus = (value: unknown): OrderStatus | null =>
  typeof value === 'string' && ORDER_STATUSES.includes(value as OrderStatus)
    ? (value as OrderStatus)
    : null;

export const parseUserRole = (value: unknown): UserRole | null =>
  typeof value === 'string' && USER_ROLES.includes(value as UserRole)
    ? (value as UserRole)
    : null;
