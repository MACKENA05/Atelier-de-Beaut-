import React from 'react';
import { useSelector } from 'react-redux';
import './Footer.css';

const Footer = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h3>About Atelier-de-Beaut</h3>
          <p>Your one-stop shop for beauty products and more. Quality and elegance in every item.</p>
        </div>
        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/shop">Shop</a></li>
            <li><a href="/account">Account</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>

            {/* Role-based admin links */}
            {!user && <li><a href="/admin-landing">Login as Admin</a></li>}
            {user && user.role === 'admin' && <li><a href="/dashboard/admin">Admin Dashboard</a></li>}
            {user && user.role === 'manager' && <li><a href="/dashboard/manager">Manager Dashboard</a></li>}
            {user && user.role === 'sales rep' && <li><a href="/dashboard/sales-rep">Sales Rep Dashboard</a></li>}
          </ul>
        </div>
        <div className="footer-section social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://facebook.com/atelierdebeaute" target="_blank" rel="noopener noreferrer" aria-label="Facebook">Facebook</a>
            <a href="https://instagram.com/atelierdebeaute" target="_blank" rel="noopener noreferrer" aria-label="Instagram">Instagram</a>
            <a href="https://twitter.com/atelierdebeaute" target="_blank" rel="noopener noreferrer" aria-label="Twitter">Twitter</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Atelier-de-Beaut. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
