import 'server-only';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SESSION_COOKIE } from '@/lib/auth';
import type { SessionUser, UserRole } from '@/lib/types';

export const getSessionUser = async (): Promise<SessionUser | null> => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const [{ adminAuth }, { getUserByFirebaseUid, upsertUserFromToken }] = await Promise.all([
      import('@/lib/firebaseAdmin'),
      import('@/lib/db'),
    ]);
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    return (await getUserByFirebaseUid(decoded.uid)) || (await upsertUserFromToken(decoded));
  } catch {
    return null;
  }
};

export const requireSessionUser = async (): Promise<SessionUser> => {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  return user;
};

export const requireRole = async (role: UserRole): Promise<SessionUser> => {
  const user = await requireSessionUser();

  if (user.role !== role) {
    redirect('/');
  }

  return user;
};
