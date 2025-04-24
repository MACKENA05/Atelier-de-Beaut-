import React, { useState } from 'react';
import './ContactForm.css';

const ContactForm = ({ onSubmit }) => {
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
    return /^[\\w.-]+@([\\w-]+\\.)+[\\w-]{2,4}$/.test(email);
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

    // Simulate API call with timeout
    setTimeout(() => {
      setLoading(false);
      setSuccess('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
      setCaptchaChecked(false);
      if (onSubmit) onSubmit();
    }, 2000);
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="name">Your Name</label>
      <input
        id="name"
        type="text"
        name="name"
        placeholder="Your Name"
        value={formData.name}
        onChange={handleInputChange}
        required
        disabled={loading}
      />
      <label htmlFor="email">Your Email</label>
      <input
        id="email"
        type="email"
        name="email"
        placeholder="Your Email"
        value={formData.email}
        onChange={handleInputChange}
        required
        disabled={loading}
      />
      <label htmlFor="message">Your Message</label>
      <textarea
        id="message"
        name="message"
        placeholder="Your Message"
        value={formData.message}
        onChange={handleInputChange}
        required
        disabled={loading}
      />
      <label className="captcha-label">
        <input
          type="checkbox"
          checked={captchaChecked}
          onChange={handleCaptchaChange}
          disabled={loading}
        />{' '}
        I'm not a robot
      </label>
      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send Message'}
      </button>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </form>
  );
};

export default ContactForm;
