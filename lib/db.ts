import 'server-only';

import type { DecodedIdToken } from 'firebase-admin/auth';
import { fallbackMenuItems } from '@/lib/menu';
import { buildCloudinaryImageUrl } from '@/lib/cloudinary';
import type {
  BookingCreateInput,
  BookingRecord,
  ContactCreateInput,
  ContactRecord,
  MenuItem,
  OrderCreateInput,
  OrderRecord,
  OrderStatus,
  SessionUser,
  UserRole,
} from '@/lib/types';

const getPrisma = async () => (await import('@/lib/prisma')).prisma;

const mapRole = (role: 'CUSTOMER' | 'ADMIN' | 'RIDER'): UserRole => role.toLowerCase() as UserRole;
const mapStatus = (status: 'PENDING' | 'CONFIRMED' | 'OUT_FOR_DELIVERY' | 'DELIVERED'): OrderStatus =>
  status.toLowerCase() as OrderStatus;

const mapMenuCategory = (
  category: 'SIGNATURE' | 'GRILL' | 'BOWLS' | 'SIDES' | 'DESSERT' | 'DRINKS'
): MenuItem['category'] => category.toLowerCase() as MenuItem['category'];

const mapMenuCategoryToPrisma = (category: MenuItem['category']) =>
  category.toUpperCase() as 'SIGNATURE' | 'GRILL' | 'BOWLS' | 'SIDES' | 'DESSERT' | 'DRINKS';

const slugify = (input: string) =>
  input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const mapMenuItem = (item: {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  category: 'SIGNATURE' | 'GRILL' | 'BOWLS' | 'SIDES' | 'DESSERT' | 'DRINKS';
  prepTime: string;
  imagePublicId: string;
  featured: boolean;
}): MenuItem => ({
  id: item.id,
  slug: item.slug,
  name: item.name,
  description: item.description,
  price: item.price,
  category: mapMenuCategory(item.category),
  prepTime: item.prepTime,
  imagePublicId: item.imagePublicId,
  imageUrl: buildCloudinaryImageUrl(item.imagePublicId),
  featured: item.featured,
});

const mapOrder = (order: {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  deliveryAddress: string;
  notes: string | null;
  total: number;
  status: 'PENDING' | 'CONFIRMED' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
  createdAt: Date;
  items: Array<{ name: string; quantity: number; price: number }>;
}): OrderRecord => ({
  id: order.id,
  userId: order.userId,
  customerName: order.customerName,
  customerEmail: order.customerEmail,
  deliveryAddress: order.deliveryAddress,
  notes: order.notes || '',
  total: order.total,
  status: mapStatus(order.status),
  createdAt: order.createdAt.toISOString(),
  items: order.items,
});

export const upsertUserFromToken = async (token: DecodedIdToken): Promise<SessionUser> => {
  const prisma = await getPrisma();
  const email = token.email || `${token.uid}@firebase.local`;
  const name = token.name || email.split('@')[0] || 'Customer';
  const normalizedEmail = email.toLowerCase();
  const normalizedName = name.toLowerCase();
  const isNjueAdmin = normalizedEmail.includes('njue') || normalizedName.includes('njue');

  const user = await prisma.user.upsert({
    where: { firebaseUid: token.uid },
    update: {
      email,
      name,
      ...(isNjueAdmin ? { role: 'ADMIN' } : {}),
    },
    create: {
      firebaseUid: token.uid,
      email,
      name,
      ...(isNjueAdmin ? { role: 'ADMIN' } : {}),
    },
  });

  return {
    id: user.id,
    firebaseUid: user.firebaseUid,
    name: user.name,
    email: user.email,
    role: mapRole(user.role),
  };
};

export const getUserByFirebaseUid = async (firebaseUid: string): Promise<SessionUser | null> => {
  const prisma = await getPrisma();
  const user = await prisma.user.findUnique({ where: { firebaseUid } });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    firebaseUid: user.firebaseUid,
    name: user.name,
    email: user.email,
    role: mapRole(user.role),
  };
};

export const listMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const prisma = await getPrisma();
    const items = await prisma.menuItem.findMany({
      where: { active: true },
      orderBy: [{ featured: 'desc' }, { name: 'asc' }],
    });

    if (items.length === 0) {
      return fallbackMenuItems;
    }

    const fallbackBySlug = new Map(fallbackMenuItems.map((item) => [item.slug, item]));
    const mappedItems = items.map(mapMenuItem).map((item) => {
      const fallback = fallbackBySlug.get(item.slug);

      if (fallback && item.imagePublicId.startsWith('myrestaurant/menu/')) {
        return {
          ...item,
          calories: fallback.calories,
          imagePublicId: fallback.imagePublicId,
          imageUrl: fallback.imageUrl,
        };
      }

      return {
        ...item,
        calories: fallback?.calories,
      };
    });
    const storedSlugs = new Set(mappedItems.map((item) => item.slug));
    const missingFallbackItems = fallbackMenuItems.filter((item) => !storedSlugs.has(item.slug));

    return [...mappedItems, ...missingFallbackItems];
  } catch {
    return fallbackMenuItems;
  }
};

export const createMenuItem = async (
  input: Omit<MenuItem, 'id' | 'slug' | 'imageUrl'> & { featured?: boolean }
): Promise<MenuItem> => {
  const prisma = await getPrisma();
  const item = await prisma.menuItem.create({
    data: {
      name: input.name.trim(),
      slug: slugify(input.name),
      description: input.description.trim(),
      price: Math.round(input.price),
      category: mapMenuCategoryToPrisma(input.category),
      prepTime: input.prepTime.trim(),
      imagePublicId: input.imagePublicId.trim() || 'default-menu-image',
      featured: input.featured ?? false,
      active: true,
    },
  });

  return mapMenuItem(item);
};

export const updateMenuItem = async (
  id: string,
  input: Partial<Omit<MenuItem, 'id' | 'slug' | 'imageUrl'>>
): Promise<MenuItem> => {
  const prisma = await getPrisma();
  const item = await prisma.menuItem.update({
    where: { id },
    data: {
      ...(input.name ? { name: input.name.trim(), slug: slugify(input.name) } : {}),
      ...(input.description ? { description: input.description.trim() } : {}),
      ...(typeof input.price === 'number' ? { price: Math.round(input.price) } : {}),
      ...(input.category ? { category: mapMenuCategoryToPrisma(input.category) } : {}),
      ...(input.prepTime ? { prepTime: input.prepTime.trim() } : {}),
      ...(input.imagePublicId ? { imagePublicId: input.imagePublicId.trim() } : {}),
      ...(typeof input.featured === 'boolean' ? { featured: input.featured } : {}),
    },
  });

  return mapMenuItem(item);
};

export const listFeaturedMenuItems = async (): Promise<MenuItem[]> => {
  const items = await listMenuItems();
  return items.filter((item) => item.featured);
};

export const listOrders = async (): Promise<OrderRecord[]> => {
  const prisma = await getPrisma();
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });

  return orders.map(mapOrder);
};

export const listOrdersForUser = async (userId: string): Promise<OrderRecord[]> => {
  const prisma = await getPrisma();
  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });

  return orders.map(mapOrder);
};

export const getOrderById = async (id: string): Promise<OrderRecord | null> => {
  const prisma = await getPrisma();
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  return order ? mapOrder(order) : null;
};

export const createOrder = async (
  input: OrderCreateInput,
  user: SessionUser
): Promise<OrderRecord> => {
  const prisma = await getPrisma();
  const total = input.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      customerName: input.customerName.trim(),
      customerEmail: input.customerEmail.trim().toLowerCase(),
      deliveryAddress: input.deliveryAddress.trim(),
      notes: input.notes?.trim() || '',
      total,
      items: {
        create: input.items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
    include: { items: true },
  });

  return mapOrder(order);
};

export const updateOrderStatus = async (
  id: string,
  status: OrderStatus
): Promise<OrderRecord | null> => {
  const prisma = await getPrisma();
  const order = await prisma.order.update({
    where: { id },
    data: {
      status: status.toUpperCase() as 'PENDING' | 'CONFIRMED' | 'OUT_FOR_DELIVERY' | 'DELIVERED',
    },
    include: { items: true },
  }).catch(() => null);

  return order ? mapOrder(order) : null;
};

export const createBooking = async (input: BookingCreateInput): Promise<BookingRecord> => {
  const prisma = await getPrisma();
  const booking = await prisma.booking.create({
    data: {
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      date: input.date,
      time: input.time,
      guests: input.guests,
      notes: input.notes?.trim() || '',
    },
  });

  return {
    ...booking,
    notes: booking.notes || '',
    createdAt: booking.createdAt.toISOString(),
  };
};

export const createContactMessage = async (
  input: ContactCreateInput
): Promise<ContactRecord> => {
  const prisma = await getPrisma();
  const message = await prisma.contactMessage.create({
    data: {
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      message: input.message.trim(),
    },
  });

  return {
    ...message,
    createdAt: message.createdAt.toISOString(),
  };
};
