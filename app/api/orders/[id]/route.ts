import { getSessionUser } from '@/lib/session';
import { parseOrderStatus } from '@/lib/validation';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export const GET = async (_request: Request, { params }: RouteContext) => {
  try {
    const { getOrderById } = await import('@/lib/db');
    const user = await getSessionUser();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const order = await getOrderById(id);

    if (!order) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }

    if (user.role === 'customer' && order.userId !== user.id) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    return Response.json(order);
  } catch (error: unknown) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch order' },
      { status: 500 }
    );
  }
};

export const PUT = async (request: Request, { params }: RouteContext) => {
  try {
    const { updateOrderStatus } = await import('@/lib/db');
    const user = await getSessionUser();

    if (!user || (user.role !== 'admin' && user.role !== 'rider')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as { status?: unknown };
    const status = parseOrderStatus(body.status);

    if (!status) {
      return Response.json({ error: 'Invalid status' }, { status: 400 });
    }

    const { id } = await params;
    const updatedOrder = await updateOrderStatus(id, status);

    if (!updatedOrder) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }

    return Response.json(updatedOrder);
  } catch (error: unknown) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to update order' },
      { status: 500 }
    );
  }
};
