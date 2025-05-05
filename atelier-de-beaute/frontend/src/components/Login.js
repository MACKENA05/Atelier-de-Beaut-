import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../slice/authSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import './AuthForm.css';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await dispatch(login(formData)).unwrap();
      navigate(from, { replace: true });
    } catch (err) {
      console.log('Login error caught:', err);
      if (typeof err === 'string') {
        setError(err);
      } else if (err && err.error) {
        setError(err.error);
      } else if (err && err.response && err.response.data) {
        const data = err.response.data;
        console.log('Error response data:', data);
        if (data.error) {
          setError(data.error);
        } else if (typeof data === 'string') {
          setError(data);
        } else {
          setError('Login failed');
        }
      } else {
        setError(err.message || 'Login failed');
      }
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Login</h2>
      {error && <p className="auth-error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label className="auth-label">
          Username or Email:
          <input type="text" name="username" value={formData.username} onChange={handleChange} required className="auth-input" />
        </label>
        <br />
        <label className="auth-label">
          Password:
          <input type="password" name="password" value={formData.password} onChange={handleChange} required className="auth-input" />
        </label>
        <br />
        <button type="submit" className="auth-button">Login</button>
      </form>
    </div>
  );
};

export default Login;
