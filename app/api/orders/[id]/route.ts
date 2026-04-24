import type { NextRequest } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { ORDER_STATUSES, type OrderRecord, type OrderUpdateInput } from '@/lib/types';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

const isOrderStatus = (value: unknown): value is OrderUpdateInput['status'] =>
  typeof value === 'string' &&
  ORDER_STATUSES.includes(value as OrderUpdateInput['status']);

const toOrderRecord = (
  id: string,
  data: FirebaseFirestore.DocumentData
): OrderRecord => ({
  id,
  userId: typeof data.userId === 'string' ? data.userId : '',
  items: Array.isArray(data.items) ? data.items : [],
  total: typeof data.total === 'number' ? data.total : 0,
  status: isOrderStatus(data.status) ? data.status : 'pending',
  createdAt:
    data.createdAt instanceof Date
      ? data.createdAt.toISOString()
      : data.createdAt?.toDate instanceof Function
        ? data.createdAt.toDate().toISOString()
        : null,
});

export const GET = async (_req: NextRequest, { params }: RouteContext) => {
  try {
    const { id } = await params;
    const doc = await db.collection('orders').doc(id).get();

    if (!doc.exists) {
      return Response.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return Response.json(toOrderRecord(doc.id, doc.data() ?? {}));
  } catch (err: unknown) {
    console.error('Orders fetch error:', err);
    return Response.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch order' },
      { status: 500 }
    );
  }
};

export const PUT = async (req: NextRequest, { params }: RouteContext) => {
  try {
    const { id } = await params;
    const body: unknown = await req.json();
    const status = (body as Partial<OrderUpdateInput>)?.status;

    if (!isOrderStatus(status)) {
      return Response.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    await db.collection('orders').doc(id).update({ status });

    return Response.json({ message: 'Order updated successfully' });
  } catch (err: unknown) {
    console.error('Order update error:', err);
    return Response.json(
      { error: err instanceof Error ? err.message : 'Failed to update order' },
      { status: 500 }
    );
  }
};
