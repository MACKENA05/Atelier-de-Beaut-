import React from 'react';
import './SocialMediaLinks.css';

const SocialMediaLinks = () => {
  return (
    <div className="social-media">
      <h2>Follow Us</h2>
      <a href="https://facebook.com/atelierdebeaute" target="_blank" rel="noopener noreferrer" className="social-link">Facebook</a> |{' '}
      <a href="https://instagram.com/atelierdebeaute" target="_blank" rel="noopener noreferrer" className="social-link">Instagram</a> |{' '}
      <a href="https://twitter.com/atelierdebeaute" target="_blank" rel="noopener noreferrer" className="social-link">Twitter</a>
    </div>
  );
};

export default SocialMediaLinks;
