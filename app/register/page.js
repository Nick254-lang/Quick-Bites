'use client';

export default function Register() {
  const handleSubmit = (e) => {
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
        <p>Already have an account? <a href="/login">Login here</a></p>
      </form>
    </main>
  );
}
