import React, { useState } from 'react';
import backgroundImage from '../assets/images/cosmeticjar.png';
import voucherImage from '../assets/images/Cosmetic voucher set.jpg';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [captchaChecked, setCaptchaChecked] = useState(false);

  const validateEmail = (email) => /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCaptchaChange = (e) => setCaptchaChecked(e.target.checked);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all fields.');
      return;
    }
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!captchaChecked) {
      setError('Please verify that you are not a robot.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
      setCaptchaChecked(false);
    }, 2000);
  };

  return (
    <div style={styles.page}>
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }

          @media (max-width: 768px) {
            .contact-container {
              flex-direction: column;
            }

            .image-container {
              display: none;
            }
          }
        `}
      </style>

      {/* Left Image */}
      <div className="image-container" style={{ ...styles.imageContainer, ...styles.leftImage }}>
        <img src={backgroundImage} alt="Left visual" style={styles.sideImage} />
      </div>

      {/* Main Content */}
      <div className="contact-container" style={styles.container}>
        <h1 style={styles.title}>Contact Us</h1>
        <form style={styles.form} onSubmit={handleSubmit} noValidate>
          <input
            style={styles.input}
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleInputChange}
            disabled={loading}
          />
          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={loading}
          />
          <textarea
            style={styles.textarea}
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleInputChange}
            disabled={loading}
          />
          <label style={styles.captchaLabel}>
            <input
              type="checkbox"
              checked={captchaChecked}
              onChange={handleCaptchaChange}
              disabled={loading}
            />{' '}
            I'm not a robot
          </label>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Sending...' : 'Send Message'}
          </button>
          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}
        </form>

        {/* Contact Info */}
        <div style={styles.contactInfo}>
          <h2>Contact Information</h2>
          <p>Address: Nairobi, Kenya</p>
          <p>Phone: +254 707590734</p>
          <p>Email: contact@atelierdebeaute.com</p>
        </div>

        {/* Google Map */}
        <div style={styles.mapContainer}>
          <iframe
            title="Atelier de Beauté Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1994.2229985379032!2d36.82194665793493!3d-1.2920651999999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d7e07935f7%3A0xf5cc3b849f2a9c34!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2ske!4v1714722406213!5m2!1sen!2ske"
            width="100%"
            height="300"
            style={{ border: 0, borderRadius: '12px' }}
            allowFullScreen=""
            loading="lazy"
          />
        </div>

        {/* Social Links */}
        <div style={styles.socialMedia}>
          <h2>Follow Us</h2>
          <a href="https://facebook.com/atelierdebeaute" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>Facebook</a> |{' '}
          <a href="https://instagram.com/atelierdebeaute" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>Instagram</a> |{' '}
          <a href="https://tiktok.com/atelierdebeaute" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>Tiktok</a>
        </div>
      </div>

      {/* Animated Voucher */}
      <div className="image-container" style={{ ...styles.imageContainer, ...styles.rightImage }}>
        <img src={voucherImage} alt="Voucher" style={styles.animatedImage} />
      </div>
    </div>
  );
};

const styles = {
  page: {
    display: 'flex',
    flexWrap: 'wrap',
    minHeight: '100vh',
    backgroundColor: '#D998A3',
  },
  imageContainer: {
    flex: '1',
    minWidth: '300px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
  leftImage: { order: 0 },
  rightImage: { order: 2 },
  sideImage: {
    width: '100%',
    height: '90vh',
    objectFit: 'cover',
    borderRadius: '12px',
    boxShadow: '0 0 12px rgba(0,0,0,0.2)',
  },
  animatedImage: {
    maxWidth: '300px',
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
    borderRadius: '12px',
    animation: 'float 4s ease-in-out infinite',
    boxShadow: '0 0 12px rgba(0,0,0,0.3)',
  },
  container: {
    flex: '2',
    padding: '2rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#000000',
    order: 1,
  },
  title: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    fontWeight: '700',
    fontSize: '2.5rem',
    letterSpacing: '0.1rem',
  },
  form: {
    maxWidth: '600px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    border: '1px solid #3a0ca3',
    fontSize: '1rem',
    backgroundColor: '#f4e1d2',
    color: '#3a0ca3',
  },
  textarea: {
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    border: '1px solid #3a0ca3',
    fontSize: '1rem',
    minHeight: '120px',
    backgroundColor: '#f4e1d2',
    color: '#3a0ca3',
    resize: 'vertical',
  },
  captchaLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.9rem',
  },
  button: {
    padding: '0.75rem 1.5rem',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#ffb703',
    color: '#3a0ca3',
    fontWeight: '600',
    cursor: 'pointer',
  },
  error: {
    color: '#ff4d4d',
    textAlign: 'center',
  },
  success: {
    color: '#4caf50',
    textAlign: 'center',
  },
  contactInfo: {
    backgroundColor: '#f4e1d2',
    padding: '1rem 2rem',
    borderRadius: '12px',
    marginTop: '2rem',
    color: '#3a0ca3',
  },
  mapContainer: {
    marginTop: '2rem',
  },
  socialMedia: {
    textAlign: 'center',
    marginTop: '2rem',
  },
  socialLink: {
    color: '#3a0ca3',
    textDecoration: 'none',
    fontWeight: '600',
  },
};

export default Contact;
