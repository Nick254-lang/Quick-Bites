import { db } from '@/lib/firebaseAdmin';

export const POST = async (req) => {
  try {
    const { userId, items, total } = await req.json();

    if (!userId || !items || !total) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const orderRef = await db.collection('orders').add({
      userId,
      items,
      total,
      status: 'pending',
      createdAt: new Date(),
    });

    return Response.json(
      { orderId: orderRef.id },
      { status: 201 }
    );
  } catch (err) {
    console.error('Order creation error:', err);
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
};
