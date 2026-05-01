'use client';

import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import type { SessionUser } from '@/lib/types';
import { useCart } from '@/components/useCart';
import { auth } from '@/lib/firebase';

type Theme = 'light' | 'dark';

const customerLinks = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/booking', label: 'Booking' },
  { href: '/contact', label: 'Contact' },
  { href: '/orders', label: 'Orders' },
];

export default function Navbar(): JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const { count } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
    setTheme(savedTheme);
    document.body.dataset.theme = savedTheme;
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const loadUser = async () => {
      const response = await fetch('/api/auth/me', { cache: 'no-store' });
      const data = (await response.json()) as { user: SessionUser | null };
      setUser(data.user);
    };

    void loadUser();
  }, [pathname]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.body.dataset.theme = nextTheme;
  };

  const handleLogout = async () => {
    await signOut(auth).catch(() => undefined);
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
    router.refresh();
  };

  const staffLink =
    user?.role === 'admin'
      ? { href: '/admin/dashboard', label: 'Admin' }
      : user?.role === 'rider'
        ? { href: '/rider/dashboard', label: 'Rider' }
        : null;

  return (
    <header className="site-header">
      <nav className="navbar">
        <Link href="/" className="brand-mark">
          <span>MR</span>
          <div>
            <strong>MyRestaurant</strong>
            <small>Orders. Tables. Dispatch.</small>
          </div>
        </Link>

        <button
          type="button"
          className="hamburger"
          onClick={() => setIsMenuOpen((current) => !current)}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          Menu
        </button>

        <div className={`nav-panel ${isMenuOpen ? 'nav-panel-open' : ''}`}>
          <ul className="nav-links">
            {customerLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={pathname === link.href ? 'nav-active' : ''}>
                  {link.label}
                </Link>
              </li>
            ))}
            {staffLink ? (
              <li>
                <Link href={staffLink.href} className={pathname === staffLink.href ? 'nav-active' : ''}>
                  {staffLink.label}
                </Link>
              </li>
            ) : null}
          </ul>

          <div className="nav-actions">
            <Link href="/checkout" className="cart-link">
              Cart
              <span>{count}</span>
            </Link>
            <button type="button" className="theme-toggle" onClick={toggleTheme}>
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
            {user ? (
              <>
                <span className="user-pill">{user.name}</span>
                <button type="button" className="ghost-button" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="ghost-button">
                  Login
                </Link>
                <Link href="/register" className="btn">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
