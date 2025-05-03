import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [captchaChecked, setCaptchaChecked] = useState(false);

  const validateEmail = (email) => {
    return /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCaptchaChange = (e) => {
    setCaptchaChecked(e.target.checked);
  };

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
    <div style={styles.container}>
      <h1 style={styles.title}>Contact Us</h1>

      <form style={styles.form} onSubmit={handleSubmit} noValidate>
        <input
          style={styles.input}
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleInputChange}
          required
          disabled={loading}
        />
        <input
          style={styles.input}
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleInputChange}
          required
          disabled={loading}
        />
        <textarea
          style={styles.textarea}
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleInputChange}
          required
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

      <div style={styles.contactInfo}>
        <h2>Reach Out to Us</h2>
        <p>Address: Nairobi, Kenya</p>
        <p>Phone: +254 707590734</p>
        <p>Email: contact@atelierdebeaute.com</p>
      </div>

      <div style={styles.mapContainer}>
        <iframe
          title="Atelier de Beauté Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9999999999995!2d2.292292615674999!3d48.85837307928744!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66fdfd1f1f1f1%3A0x123456789abcdef!2sEiffel%20Tower!5e0!3m2!1sen!2sfr!4v1610000000000!5m2!1sen!2sfr"
          width="100%"
          height="300"
          style={{ border: 0, borderRadius: '12px' }}
          allowFullScreen=""
          loading="lazy"
        />
      </div>

      <div style={styles.socialMedia}>
        <h2>Follow Us</h2>
        <p>Stay connected with us through our social media channels!</p>
        <a href="https://facebook.com/atelierdebeaute" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>Facebook</a> |{' '}
        <a href="https://instagram.com/atelierdebeaute" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>Instagram</a> |{' '}
        <a href="https://twitter.com/atelierdebeaute" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>Twitter</a>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#ffffff',
    color: '#3a0ca3',
    minHeight: '100vh',
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
    outline: 'none',
    fontSize: '1rem',
    backgroundColor: '#f4e1d2',
    color: '#3a0ca3',
    boxShadow: '0 0 8px #a0a0a0',
    transition: 'box-shadow 0.3s ease',
  },
  textarea: {
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    border: '1px solid #3a0ca3',
    outline: 'none',
    fontSize: '1rem',
    minHeight: '120px',
    backgroundColor: '#f4e1d2',
    color: '#3a0ca3',
    boxShadow: '0 0 8px #a0a0a0',
    transition: 'box-shadow 0.3s ease',
    resize: 'vertical',
  },
  captchaLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.9rem',
    userSelect: 'none',
  },
  button: {
    marginTop: '1rem',
    padding: '0.75rem 1.5rem',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#ffb703',
    color: '#3a0ca3',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 0 12px #cc7a3a',
    transition: 'background-color 0.3s ease',
  },
  error: {
    color: '#ff4d4d',
    marginTop: '1rem',
    textAlign: 'center',
  },
  success: {
    color: '#4caf50',
    marginTop: '1rem',
    textAlign: 'center',
  },
  contactInfo: {
    maxWidth: '600px',
    margin: '2rem auto 0',
    backgroundColor: '#f4e1d2',
    padding: '1rem 2rem',
    borderRadius: '12px',
    boxShadow: '0 0 12px #a0a0a0',
    color: '#3a0ca3',
  },
  mapContainer: {
    maxWidth: '600px',
    margin: '2rem auto',
  },
  socialMedia: {
    maxWidth: '600px',
    margin: '2rem auto',
    textAlign: 'center',
  },
  socialLink: {
    color: '#3a0ca3',
    textDecoration: 'none',
    fontWeight: '600',
  },
};

export default Contact;
