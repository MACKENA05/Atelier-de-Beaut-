import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../slice/authSlice';
import { useNavigate, useLocation } from 'react-router-dom';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: ''
  });
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    console.log('Submitting registration with data:', formData);
    try {
      await dispatch(register(formData)).unwrap();
      console.log('Registration successful');
      navigate(from, { replace: true });
    } catch (err) {
      console.log('Registration error:', err);
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (data.details) {
          const messages = Object.entries(data.details).map(
            ([field, msgs]) => `${field}: ${msgs.join(', ')}`
          ).join('; ');
          setError(messages);
        } else if (data.error) {
          setError(data.error);
        } else if (typeof data === 'string') {
          setError(data);
        } else {
          setError('Registration failed');
        }
      } else if (typeof err === 'string') {
        setError(err);
      } else if (err.error) {
        setError(err.error);
      } else if (err.details) {
        const messages = Object.entries(err.details).map(
          ([field, msgs]) => `${field}: ${msgs.join(', ')}`
        ).join('; ');
        setError(messages);
      } else {
        setError(err.message || 'Registration failed');
      }
    }
  };

  return (
    <div>
      <h2>Create Account</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Password:
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </label>
        <br />
        <label>
          First Name:
          <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} />
        </label>
        <br />
        <label>
          Last Name:
          <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} />
        </label>
        <br />
        <label>
          Phone:
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
        </label>
        <br />
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
};

export default Register;
