import { getSessionUser } from '@/lib/session';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const GET = async () => {
  const user = await getSessionUser();
  return Response.json({ user });
};
