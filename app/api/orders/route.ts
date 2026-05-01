import { getSessionUser } from '@/lib/session';
import { parseOrderCreateInput } from '@/lib/validation';

export const GET = async () => {
  try {
    const { listOrders, listOrdersForUser } = await import('@/lib/db');
    const user = await getSessionUser();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders =
      user.role === 'customer'
        ? await listOrdersForUser(user.id)
        : await listOrders();

    return Response.json(orders);
  } catch (error: unknown) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch orders' },
      { status: 500 }
    );
  }
};

export const POST = async (request: Request) => {
  try {
    const { createOrder } = await import('@/lib/db');
    const user = await getSessionUser();

    if (!user) {
      return Response.json({ error: 'Please log in to place an order' }, { status: 401 });
    }

    const body: unknown = await request.json();
    const input = parseOrderCreateInput(body);

    if (!input) {
      return Response.json({ error: 'Invalid order details' }, { status: 400 });
    }

    const order = await createOrder(input, user);
    return Response.json(order, { status: 201 });
  } catch (error: unknown) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to create order' },
      { status: 500 }
    );
  }
};
