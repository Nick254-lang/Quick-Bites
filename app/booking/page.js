'use client';

export default function Booking() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Booking submitted');
    // TODO: Connect to Firebase
  };

  return (
    <main className="container">
      <h1>Reserve a Table</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Your Name" required />
        <input type="email" placeholder="Your Email" required />
        <input type="date" required />
        <input type="time" required />
        <input type="number" placeholder="Number of Guests" min="1" max="10" required />
        <button type="submit" className="btn">Reserve Table</button>
      </form>
    </main>
  );
}
