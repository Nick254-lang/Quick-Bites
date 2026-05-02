'use client';

import type { JSX } from 'react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/components/useCart';
import { useMultiAuth } from '@/components/useMultiAuth';

type Theme = 'light' | 'dark';

const customerLinks = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/booking', label: 'Booking' },
  { href: '/contact', label: 'Contact' },
  { href: '/orders', label: 'Orders' },
];

export default function Navbar(): JSX.Element {
  const pathname = usePathname();
  const { count } = useCart();
  const { users, currentUser, switchUser, removeUser, logout } = useMultiAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const profileModalRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
    setTheme(savedTheme);
    document.body.dataset.theme = savedTheme;
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setShowProfileModal(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileModalRef.current && !profileModalRef.current.contains(event.target as Node)) {
        setShowProfileModal(false);
      }
    };

    if (showProfileModal) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
    return undefined;
  }, [showProfileModal]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowProfileModal(false);
      }
    };

    if (showProfileModal) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }

    return undefined;
  }, [showProfileModal]);

  const handleLogout = async () => {
    await logout();
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.body.dataset.theme = nextTheme;
  };

  const staffLink =
    currentUser?.role === 'admin'
      ? { href: '/admin/dashboard', label: 'Admin' }
      : currentUser?.role === 'rider'
        ? { href: '/rider/dashboard', label: 'Rider' }
        : null;

  return (
    <>
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
              {currentUser ? (
                <>
                  <button
                    type="button"
                    className="user-pill"
                    onClick={() => setShowProfileModal(!showProfileModal)}
                    aria-expanded={showProfileModal}
                    aria-controls="profile-drawer"
                    aria-label="Show profile details"
                  >
                    {currentUser.name}
                  </button>
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

      {currentUser && showProfileModal ? (
        <div className="profile-modal-overlay">
          <aside
            id="profile-drawer"
            className="profile-modal"
            ref={profileModalRef}
            aria-label="Profile details"
            aria-modal="true"
            role="dialog"
          >
            <div className="profile-modal-header">
              <h3>Profile</h3>
              <button
                type="button"
                className="close-button"
                onClick={() => setShowProfileModal(false)}
                aria-label="Close profile modal"
              >
                ×
              </button>
            </div>
            <div className="profile-modal-content">
              <div className="profile-section">
                <div className="profile-section-label">Current Account</div>
                <div className="current-user-card">
                  <div className="profile-field">
                    <label>Name:</label>
                    <span>{currentUser.name}</span>
                  </div>
                  <div className="profile-field">
                    <label>Email:</label>
                    <span>{currentUser.email}</span>
                  </div>
                  <div className="profile-field">
                    <label>Role:</label>
                    <span className={`role-badge role-badge-${currentUser.role}`}>
                      {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {users.length > 1 && (
                <div className="profile-section">
                  <div className="profile-section-label">Other Accounts ({users.length - 1})</div>
                  <div className="accounts-list">
                    {users.map(user => (
                      user.id !== currentUser.id && (
                        <div key={user.id} className="account-item">
                          <div className="account-info">
                            <div className="account-name">{user.name}</div>
                            <div className="account-email">{user.email}</div>
                          </div>
                          <div className="account-actions">
                            <button
                              type="button"
                              className="btn-small btn-switch"
                              onClick={() => switchUser(user.id)}
                            >
                              Switch
                            </button>
                            <button
                              type="button"
                              className="btn-small btn-remove"
                              onClick={() => removeUser(user.id)}
                              title="Remove account"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}

              <div className="profile-actions">
                <Link href="/login" className="btn-add-account">
                  + Add Another Account
                </Link>
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
