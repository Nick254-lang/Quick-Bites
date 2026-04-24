'use client';

import Link from 'next/link';
import type { FormEvent } from 'react';

export default function Register(): JSX.Element {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Register submitted');
    // TODO: Connect to Firebase Auth
  };

  return (
    <main className="container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Full Name" required />
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <input type="password" placeholder="Confirm Password" required />
        <button type="submit" className="btn">Register</button>
        <p>Already have an account? <Link href="/login">Login here</Link></p>
      </form>
    </main>
  );
}
