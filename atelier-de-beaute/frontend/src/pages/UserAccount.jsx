import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { login, signup, logout, fetchCurrentUser } from '../redux/authSlice';
import { toast } from 'react-toastify';
import './UserAccount.css';

import fragranceSale from '../assets/images/fragrance sale.jpg';
import fragranceInfo from '../assets/images/datenight.jpg';

const UserAccount = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
  });

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    setActiveTab(user ? 'account' : 'login');
  }, [user]);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === 'phone' ? value.replace(/\D/g, '') : value;
    setSignUpData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    dispatch(login(loginData));
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    dispatch(signup(signUpData));
  };

  const handleLogout = () => {
    dispatch(logout());
    setLoginData({ email: '', password: '' });
    setSignUpData({
      username: '',
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      phone: '',
    });
  };

  return (
    <div className="container">
      <h1 className="title">User Account</h1>

      <div className="tabContainer">
        {!user ? (
          <>
            <button
              className={activeTab === 'login' ? 'activeTabButton' : 'tabButton'}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button
              className={activeTab === 'signup' ? 'activeTabButton' : 'tabButton'}
              onClick={() => setActiveTab('signup')}
            >
              Sign Up
            </button>
          </>
        ) : (
          <button className="logoutButton" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="errorMessage">{error}</p>}

      {!user && activeTab === 'login' && (
        <form className="form" onSubmit={handleLoginSubmit}>
          <input className="input" type="email" name="email" placeholder="Email" value={loginData.email} onChange={handleLoginChange} required />
          <input className="input" type="password" name="password" placeholder="Password" value={loginData.password} onChange={handleLoginChange} required />
          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
      )}

      {!user && activeTab === 'signup' && (
        <form className="form" onSubmit={handleSignUpSubmit}>
          <input className="input" type="text" name="username" placeholder="Username" value={signUpData.username} onChange={handleSignUpChange} required />
          <input className="input" type="email" name="email" placeholder="Email" value={signUpData.email} onChange={handleSignUpChange} required />
          <input className="input" type="password" name="password" placeholder="Password" value={signUpData.password} onChange={handleSignUpChange} required />
          <input className="input" type="text" name="first_name" placeholder="First Name" value={signUpData.first_name} onChange={handleSignUpChange} />
          <input className="input" type="text" name="last_name" placeholder="Last Name" value={signUpData.last_name} onChange={handleSignUpChange} />
          <input className="input" type="text" name="phone" placeholder="Phone Number" value={signUpData.phone} onChange={handleSignUpChange} />
          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
      )}

      {user && activeTab === 'account' && (
        <div className="accountSection">
          <div className="card">
            <h2 className="cardTitle">Welcome, {user.username}</h2>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phone || 'Not provided'}</p>
          </div>

          <div className="promoContainer">
            <img src={fragranceSale} alt="Fragrance Sale" className="promoImage" />
            <img src={fragranceInfo} alt="Fragrance Info" className="promoImage" />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAccount;
