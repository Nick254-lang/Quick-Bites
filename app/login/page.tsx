'use client';

import type { FormEvent, JSX } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getLoginErrorMessage } from '@/lib/firebaseAuthErrors';
import type { SessionUser } from '@/lib/types';

const MULTI_AUTH_KEY = 'multi_auth_sessions';
const CURRENT_USER_KEY = 'current_user_id';
const AUTH_SESSION_EVENT = 'multi-auth-session-change';

const storeSessionUser = (user: SessionUser) => {
  const stored = localStorage.getItem(MULTI_AUTH_KEY);
  const users = stored ? (JSON.parse(stored) as Array<SessionUser & { timestamp?: number }>) : [];
  const nextUsers = [...users.filter((item) => item.id !== user.id), { ...user, timestamp: Date.now() }];

  localStorage.setItem(MULTI_AUTH_KEY, JSON.stringify(nextUsers));
  localStorage.setItem(CURRENT_USER_KEY, user.id);
  window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
};

export default function LoginPage(): JSX.Element {
  const router = useRouter();
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');

    setSubmitting(true);
    setStatus('');

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await credential.user.getIdToken();
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      const data = (await response.json()) as { user?: SessionUser; error?: string };
      setSubmitting(false);

      if (!response.ok) {
        setStatus(data.error ?? 'Unable to log in.');
        return;
      }

      if (data.user) {
        storeSessionUser(data.user);
      }

      if (data.user?.role === 'admin') {
        router.push('/admin/dashboard');
        return;
      }

      if (data.user?.role === 'rider') {
        router.push('/rider/dashboard');
        return;
      }

      router.push('/orders');
    } catch (error: unknown) {
      setSubmitting(false);
      setStatus(getLoginErrorMessage(error));
    }
  };

  return (
    <main className="container page-shell">
      <section className="form-shell">
        <div>
          <p className="eyebrow">Sign in</p>
          <h1>Welcome back</h1>
          <p className="section-copy">
            Sign in with Firebase Auth, then the app will sync your profile and role data from Postgres.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="card">
          <input name="email" type="email" placeholder="Email" required />
          <input name="password" type="password" placeholder="Password" required />
          {status ? <p className="status-banner status-error">{status}</p> : null}
          <button type="submit" className="btn" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Log in'}
          </button>
          <p>
            Do not have an account? <Link href="/register">Register here</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
