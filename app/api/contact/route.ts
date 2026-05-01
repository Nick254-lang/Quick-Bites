import { parseContactInput } from '@/lib/validation';

export const POST = async (request: Request) => {
  try {
    const { createContactMessage } = await import('@/lib/db');
    const body: unknown = await request.json();
    const input = parseContactInput(body);

    if (!input) {
      return Response.json({ error: 'Invalid message details' }, { status: 400 });
    }

    const contact = await createContactMessage(input);
    return Response.json(contact, { status: 201 });
  } catch (error: unknown) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to send message' },
      { status: 500 }
    );
  }
};
