import type { NextRequest } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import type { OrderCreateInput, OrderItem, OrderRecord } from '@/lib/types';

const isOrderItem = (value: unknown): value is OrderItem => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const item = value as Partial<OrderItem>;
  return (
    typeof item.name === 'string' &&
    typeof item.quantity === 'number' &&
    typeof item.price === 'number'
  );
};

const toOrderRecord = (
  id: string,
  data: FirebaseFirestore.DocumentData
): OrderRecord => ({
  id,
  userId: typeof data.userId === 'string' ? data.userId : '',
  items: Array.isArray(data.items) ? data.items.filter(isOrderItem) : [],
  total: typeof data.total === 'number' ? data.total : 0,
  status: data.status === 'confirmed' || data.status === 'out_for_delivery' || data.status === 'delivered'
    ? data.status
    : 'pending',
  createdAt:
    data.createdAt instanceof Date
      ? data.createdAt.toISOString()
      : data.createdAt?.toDate instanceof Function
        ? data.createdAt.toDate().toISOString()
        : null,
});

const parseCreateOrderInput = (body: unknown): OrderCreateInput | null => {
  if (typeof body !== 'object' || body === null) {
    return null;
  }

  const { userId, items, total } = body as Partial<OrderCreateInput>;

  if (
    typeof userId !== 'string' ||
    !Array.isArray(items) ||
    !items.every(isOrderItem) ||
    typeof total !== 'number'
  ) {
    return null;
  }

  return { userId, items, total };
};

export const GET = async () => {
  try {
    const snapshot = await db.collection('orders').get();
    const orders = snapshot.docs.map((doc) => toOrderRecord(doc.id, doc.data()));

    return Response.json(orders);
  } catch (err: unknown) {
    console.error('Orders fetch error:', err);
    return Response.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch orders' },
      { status: 500 }
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const body: unknown = await req.json();
    const input = parseCreateOrderInput(body);

    if (!input) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const orderRef = await db.collection('orders').add({
      userId: input.userId,
      items: input.items,
      total: input.total,
      status: 'pending',
      createdAt: new Date(),
    });

    return Response.json(
      { orderId: orderRef.id },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error('Order creation error:', err);
    return Response.json(
      { error: err instanceof Error ? err.message : 'Failed to create order' },
      { status: 500 }
    );
  }
};
