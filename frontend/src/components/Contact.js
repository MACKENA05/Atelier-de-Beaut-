import React, { useState } from 'react';
import './Pages.css';
import Alert from './Alert';
import './Alert.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const [alertMessage, setAlertMessage] = React.useState('');
  const [alertType, setAlertType] = React.useState('info');

  const handleSubmit = (e) => {
    e.preventDefault();
    setAlertMessage('Message sent! We will get back to you soon.');
    setAlertType('success');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleCloseAlert = () => {
    setAlertMessage('');
  };

  return (
    <div className="container">
      <h1>Contact Page</h1>
      <p>This is the contact page. Contact information and form will be displayed here.</p>
      {alertMessage && (
        <Alert message={alertMessage} type={alertType} onClose={handleCloseAlert} />
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="5"
            required
          />
        </div>
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Contact;
