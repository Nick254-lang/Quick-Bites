'use client';

import type { FormEvent } from 'react';

export default function Contact(): JSX.Element {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Message sent');
    // TODO: Connect to Firebase
  };

  return (
    <main className="container">
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Your Name" required />
        <input type="email" placeholder="Your Email" required />
        <textarea placeholder="Your Message" rows="5" required></textarea>
        <button type="submit" className="btn">Send Message</button>
      </form>
    </main>
  );
}
