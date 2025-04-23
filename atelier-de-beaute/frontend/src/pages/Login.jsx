import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

const mockUsers = [
  { email: 'admin@example.com', password: 'admin123', role: 'administrator' },
  { email: 'productmanager@example.com', password: 'product123', role: 'product_manager' },
  { email: 'deliverymanager@example.com', password: 'delivery123', role: 'delivery_manager' },
];

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = mockUsers.find(
      (u) => u.email === formData.email && u.password === formData.password
    );
    if (user) {
      setError('');
      // Save user role in sessionStorage or context for access in landing page
      sessionStorage.setItem('userRole', user.role);
      navigate('/landing');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Login</h1>
      <form style={styles.form} onSubmit={handleSubmit}>
        <input
          style={styles.input}
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <input
          style={styles.input}
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        <button type="submit" style={styles.button}>
          Log In
        </button>
        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#1a1a2e',
    color: '#eaeaea',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: '1.5rem',
    fontWeight: '700',
    fontSize: '2.5rem',
    letterSpacing: '0.1rem',
  },
  form: {
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    border: 'none',
    outline: 'none',
    fontSize: '1rem',
    backgroundColor: '#16213e',
    color: '#eaeaea',
    boxShadow: '0 0 8px #0f3460',
    transition: 'box-shadow 0.3s ease',
  },
  button: {
    marginTop: '1rem',
    padding: '0.75rem 1.5rem',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#0f3460',
    color: '#eaeaea',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 0 12px #0f3460',
    transition: 'background-color 0.3s ease',
  },
};

export default Login;
