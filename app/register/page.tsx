'use client';

import type { FormEvent, JSX } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getRegisterErrorMessage } from '@/lib/firebaseAuthErrors';
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

export default function RegisterPage(): JSX.Element {
  const router = useRouter();
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') ?? '');
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');
    const confirmPassword = String(formData.get('confirmPassword') ?? '');

    if (password !== confirmPassword) {
      setStatus('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    setStatus('');

    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName: name });
      const idToken = await credential.user.getIdToken(true);
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      const data = (await response.json()) as { user?: SessionUser; error?: string };

      setSubmitting(false);

      if (!response.ok) {
        setStatus(data.error ?? 'Unable to register.');
        return;
      }

      if (data.user) {
        storeSessionUser(data.user);
      }

      router.push('/orders');
    } catch (error: unknown) {
      setSubmitting(false);
      setStatus(getRegisterErrorMessage(error));
    }
  };

  return (
    <main className="container page-shell">
      <section className="form-shell">
        <div>
          <p className="eyebrow">Create account</p>
          <h1>Start ordering in minutes</h1>
          <p className="section-copy">
            Registration uses Firebase Auth for identity, then stores your app profile and role data in Postgres.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="card">
          <input name="name" type="text" placeholder="Full name" required />
          <input name="email" type="email" placeholder="Email" required />
          <input name="password" type="password" placeholder="Password" minLength={8} required />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
            minLength={8}
            required
          />
          {status ? <p className="status-banner status-error">{status}</p> : null}
          <button type="submit" className="btn" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Register'}
          </button>
          <p>
            Already have an account? <Link href="/login">Login here</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
