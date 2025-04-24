import React from 'react';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-container">
      <h1 className="privacy-title">Privacy Policy</h1>
      <section className="privacy-section">
        <h2>Introduction</h2>
        <p>
          At Atelier de Beauté, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information.
        </p>
      </section>
      <section className="privacy-section">
        <h2>Information We Collect</h2>
        <p>
          We collect information you provide directly to us, such as when you create an account, place an order, or contact customer service. This may include your name, email address, phone number, and payment information.
        </p>
      </section>
      <section className="privacy-section">
        <h2>How We Use Your Information</h2>
        <p>
          We use your information to process orders, communicate with you, improve our services, and comply with legal obligations.
        </p>
      </section>
      <section className="privacy-section">
        <h2>Sharing Your Information</h2>
        <p>
          We do not sell your personal information. We may share information with trusted third parties who assist us in operating our website and business, subject to confidentiality agreements.
        </p>
      </section>
      <section className="privacy-section">
        <h2>Your Choices</h2>
        <p>
          You can update your account information and communication preferences at any time. You may also opt out of marketing communications.
        </p>
      </section>
      <section className="privacy-section">
        <h2>Security</h2>
        <p>
          We implement reasonable security measures to protect your information from unauthorized access.
        </p>
      </section>
      <section className="privacy-section">
        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at contact@atelierdebeaute.com.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
