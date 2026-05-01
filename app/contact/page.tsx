'use client';

import type { FormEvent, JSX } from 'react';
import { useState } from 'react';

export default function ContactPage(): JSX.Element {
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setSubmitting(true);
    setStatus('');

    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
      }),
    });

    const data = (await response.json()) as { error?: string };

    setSubmitting(false);

    if (!response.ok) {
      setStatus(data.error ?? 'Unable to send your message.');
      return;
    }

    event.currentTarget.reset();
    setStatus('Message sent. We will get back to you shortly.');
  };

  return (
    <main className="container page-shell">
      <section className="form-shell">
        <div>
          <p className="eyebrow">Support</p>
          <h1>Contact the team</h1>
          <p className="section-copy">
            Reach out about catering, private dining, order help, or partnerships.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="card">
          <input name="name" type="text" placeholder="Your name" required />
          <input name="email" type="email" placeholder="Your email" required />
          <textarea name="message" placeholder="How can we help?" rows={6} required />
          {status ? <p className="status-banner">{status}</p> : null}
          <button type="submit" className="btn" disabled={submitting}>
            {submitting ? 'Sending...' : 'Send message'}
          </button>
        </form>
      </section>
    </main>
  );
}
