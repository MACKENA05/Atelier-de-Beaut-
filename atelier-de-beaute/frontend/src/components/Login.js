import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../slice/authSlice';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  console.log('Login component rendered');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(state => state.auth.user);
  console.log('User from Redux state:', user);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    console.log('Login useEffect triggered with user:', user);
    if (user) {
      const role = user.role ? user.role.toLowerCase() : '';
      console.log('User role:', role);
      switch (role) {
        case 'admin':
          console.log('Navigating to /admin');
          navigate('/admin', { replace: true });
          break;
        case 'sales-representative':
          console.log('Navigating to /sales-rep');
          navigate('/sales-rep', { replace: true });
          break;
        case 'manager':
          console.log('Navigating to /manager');
          navigate('/manager', { replace: true });
          break;
        case 'customer':
          console.log('Navigating to /my-orders');
          navigate('/my-orders', { replace: true });
          break;
        default:
          console.log('Navigating to fallback:', from);
          navigate(from, { replace: true });
      }
    }
  }, [user, navigate, from]);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    console.log('Submitting login with:', formData);
    try {
      await dispatch(login(formData)).unwrap();
      console.log('Login dispatched successfully');
    } catch (err) {
      console.log('Login error caught:', err);
      setError(typeof err === 'string' ? err : 'Login failed');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username or Email" required />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
