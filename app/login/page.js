'use client';

export default function Login() {
  const handleSubmit = (e) => {
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
        <p>Don't have an account? <a href="/register">Register here</a></p>
      </form>
    </main>
  );
}
