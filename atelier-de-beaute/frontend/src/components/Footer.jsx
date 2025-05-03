import React from 'react';
import './Footer.css';

import facebookIcon from '../assets/images/facebook-icon.svg';
import instagramIcon from '../assets/images/instagram-icon.svg';
import tiktokIcon from '../assets/images/tiktok-icon.svg';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* About Section */}
        <div className="footer-section about">
          <h3>About Atelier-de-Beauté</h3>
          <p>Your one-stop shop for beauty products and more. Quality and elegance in every item.</p>
        </div>
        
        {/* Quick Links Section */}
        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/shop">Shop</a></li>
            <li><a href="/account">Account</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/admin">Login as Admin</a></li>
          </ul>
        </div>

        {/* Social Media Section */}
        <div className="footer-section social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <div className="social-item">
              <img src={facebookIcon} alt="Facebook" />
              <p>Facebook: @atelierdebeaute</p>
            </div>
            <div className="social-item">
              <img src={instagramIcon} alt="Instagram" />
              <p>Instagram: @atelierdebeaute</p>
            </div>
            <div className="social-item">
              <img src={tiktokIcon} alt="Twitter" />
              <p>Twitter: @atelierdebeaute</p>
            </div>
          </div>
        </div>
      </div>
      {/* Footer Bottom Section */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Atelier-de-Beauté. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;