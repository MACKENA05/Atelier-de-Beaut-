import React from 'react';
import './Pages.css';

const PrivacyPolicy = () => {
  return (
    <div className="container">
      <h1>Privacy Policy</h1>
      <section>
        <h2>Introduction</h2>
        <p>We value your privacy and are committed to protecting your personal information.</p>
      </section>
      <section>
        <h2>Information Collection</h2>
        <p>We collect information you provide when you create an account, place an order, or contact us.</p>
      </section>
      <section>
        <h2>Use of Information</h2>
        <p>Your information is used to process orders, improve our services, and communicate with you.</p>
      </section>
      <section>
        <h2>Data Security</h2>
        <p>We implement security measures to protect your data from unauthorized access.</p>
      </section>
      <section>
        <h2>Contact Us</h2>
        <p>If you have any questions about this privacy policy, please contact us.</p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
