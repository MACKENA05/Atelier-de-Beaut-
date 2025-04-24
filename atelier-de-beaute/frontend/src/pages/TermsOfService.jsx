import React from 'react';
import './TermsOfService.css';

const TermsOfService = () => {
  return (
    <div className="tos-container">
      <h1 className="tos-title">Terms of Service</h1>
      <section className="tos-section">
        <h2>Introduction</h2>
        <p>
          Welcome to Atelier de Beauté. By using our website, you agree to comply with and be bound by the following terms and conditions.
        </p>
      </section>
      <section className="tos-section">
        <h2>Use of Website</h2>
        <p>
          You agree to use the website only for lawful purposes and in a way that does not infringe the rights of others.
        </p>
      </section>
      <section className="tos-section">
        <h2>Product Information</h2>
        <p>
          We strive to provide accurate product information but do not guarantee completeness or accuracy.
        </p>
      </section>
      <section className="tos-section">
        <h2>Orders and Payments</h2>
        <p>
          All orders are subject to acceptance and availability. Payment terms are as specified at checkout.
        </p>
      </section>
      <section className="tos-section">
        <h2>Limitation of Liability</h2>
        <p>
          We are not liable for any damages arising from the use of our website or products.
        </p>
      </section>
      <section className="tos-section">
        <h2>Changes to Terms</h2>
        <p>
          We reserve the right to update these terms at any time without prior notice.
        </p>
      </section>
      <section className="tos-section">
        <h2>Contact Us</h2>
        <p>
          For any questions regarding these terms, please contact us at contact@atelierdebeaute.com.
        </p>
      </section>
    </div>
  );
};

export default TermsOfService;
