import { cookies } from 'next/headers';
import { SESSION_COOKIE } from '@/lib/auth';

const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const getSessionErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
    return 'An account with this email already exists. Please log in instead.';
  }

  return 'Failed to create session';
};

export const POST = async (request: Request) => {
  try {
    const [{ adminAuth }, { upsertUserFromToken }] = await Promise.all([
      import('@/lib/firebaseAdmin'),
      import('@/lib/db'),
    ]);
    const body = (await request.json()) as { idToken?: string };

    if (!body.idToken) {
      return Response.json({ error: 'Missing Firebase ID token' }, { status: 400 });
    }

    const decoded = await adminAuth.verifyIdToken(body.idToken);
    const sessionCookieValue = await adminAuth.createSessionCookie(body.idToken, {
      expiresIn: SESSION_DURATION_MS,
    });
    const user = await upsertUserFromToken(decoded);

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, sessionCookieValue, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: SESSION_DURATION_MS / 1000,
    });

    return Response.json({ user });
  } catch (error: unknown) {
    return Response.json({ error: getSessionErrorMessage(error) }, { status: 401 });
  }
};
