'use client';

import Link from 'next/link';
import type { FormEvent } from 'react';

export default function Login(): JSX.Element {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Login submitted');
    // TODO: Connect to Firebase Auth
  };

  return (
    <main className="container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit" className="btn">Login</button>
        <p>Don&apos;t have an account? <Link href="/register">Register here</Link></p>
      </form>
    </main>
  );
}
