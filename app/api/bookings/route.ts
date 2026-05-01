import { parseBookingInput } from '@/lib/validation';

export const POST = async (request: Request) => {
  try {
    const { createBooking } = await import('@/lib/db');
    const body: unknown = await request.json();
    const input = parseBookingInput(body);

    if (!input) {
      return Response.json({ error: 'Invalid reservation details' }, { status: 400 });
    }

    const booking = await createBooking(input);
    return Response.json(booking, { status: 201 });
  } catch (error: unknown) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to create reservation' },
      { status: 500 }
    );
  }
};
