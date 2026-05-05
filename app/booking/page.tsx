'use client';

import type { FormEvent, JSX } from 'react';
import { useState } from 'react';

export default function BookingPage(): JSX.Element {
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setSubmitting(true);
    setStatus('');

    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.get('name'),
        email: formData.get('email'),
        date: formData.get('date'),
        time: formData.get('time'),
        guests: Number(formData.get('guests')),
        notes: formData.get('notes'),
      }),
    });

    const data = (await response.json()) as { error?: string };

    setSubmitting(false);

    if (!response.ok) {
      setStatus(data.error ?? 'Unable to save reservation.');
      return;
    }

    event.currentTarget.reset();
    setStatus('Reservation received. We will contact you to confirm.');
  };

  return (
    <main className="container page-shell">
      <section className="form-shell">
        <div>
          <p className="eyebrow">Reserve</p>
          <h1>Book a table without leaving the app</h1>
          <p className="section-copy">
            Great for date nights, team lunches, and weekend groups. Reservations are stored instantly.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="card">
          <input name="name" type="text" autoComplete="name" placeholder="Your name" required />
          <input name="email" type="email" autoComplete="email" placeholder="Your email" required />
          <input name="date" type="date" autoComplete="off" required />
          <input name="time" type="time" autoComplete="off" required />
          <input name="guests" type="number" autoComplete="off" placeholder="Number of guests" min="1" max="20" required />
          <textarea name="notes" autoComplete="off" placeholder="Special requests" rows={4} />
          {status ? <p className="status-banner">{status}</p> : null}
          <button type="submit" className="btn" disabled={submitting}>
            {submitting ? 'Saving...' : 'Reserve table'}
          </button>
        </form>
      </section>
    </main>
  );
}
