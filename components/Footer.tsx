import type { JSX } from 'react';

export default function Footer(): JSX.Element {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-section footer-brand">
          <strong>MyRestaurant</strong>
          <p>Fresh food and delivery from our restaurant in New York City.</p>
        </div>

        <div className="footer-section">
          <h3>Social</h3>
          <ul className="footer-links">
            <li>
              <a href="https://instagram.com/myrestaurant" target="_blank" rel="noreferrer">
                Instagram
              </a>
            </li>
            <li>
              <a href="https://facebook.com/myrestaurant" target="_blank" rel="noreferrer">
                Facebook
              </a>
            </li>
            <li>
              <a href="https://twitter.com/myrestaurant" target="_blank" rel="noreferrer">
                Twitter
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Location</h3>
          <address>
            123 Main Street<br />
            New York, NY 10001
          </address>
        </div>
      </div>

      <div className="container footer-bottom">
        <small>© {new Date().getFullYear()} MyRestaurant. All rights reserved.</small>
        <small>Contact us at hello@myrestaurant.app</small>
      </div>
    </footer>
  );
}
