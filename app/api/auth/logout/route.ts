import { cookies } from 'next/headers';
import { SESSION_COOKIE } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const POST = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);

  return Response.json({ ok: true });
};
