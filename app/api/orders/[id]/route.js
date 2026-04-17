import { db } from '@/lib/firebaseAdmin';

export const GET = async (req) => {
  try {
    const snapshot = await db.collection('orders').get();
    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return Response.json(orders);
  } catch (err) {
    console.error('Orders fetch error:', err);
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
};

export const PUT = async (req, { params }) => {
  try {
    const { id } = params;
    const { status } = await req.json();

    if (!status) {
      return Response.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    await db.collection('orders').doc(id).update({ status });

    return Response.json({ message: 'Order updated successfully' });
  } catch (err) {
    console.error('Order update error:', err);
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
};
