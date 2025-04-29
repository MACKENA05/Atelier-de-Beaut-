import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { login, signup, logout, fetchCurrentUser } from '../redux/authSlice';
import './UserAccount.css';
import luxuryCreamImage from '../assets/images/Luxury cream.jpg';

const UserAccount = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setActiveTab('account');
    } else {
      setActiveTab('login');
    }
  }, [user]);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUpData((prev) => ({ ...prev, [name]: value }));
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
    setSignUpData({ name: '', email: '', password: '' });
  };

  return (
    <div
      className="container"
      style={{
        backgroundImage: `url(${luxuryCreamImage})`,
        backgroundColor: 'transparent',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <h1 className="title">User Account</h1>
      <div className="tabContainer">
        {!user && (
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
        )}
        {user && (
          <button className="logoutButton" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="errorMessage">{error}</p>}

      {!user && activeTab === 'login' && (
        <form className="form" onSubmit={handleLoginSubmit}>
          <input
            className="input"
            type="email"
            name="email"
            placeholder="Email"
            value={loginData.email}
            onChange={handleLoginChange}
            required
          />
          <input
            className="input"
            type="password"
            name="password"
            placeholder="Password"
            value={loginData.password}
            onChange={handleLoginChange}
            required
          />
          <button type="submit" className="button">
            Log In
          </button>
        </form>
      )}

      {!user && activeTab === 'signup' && (
        <form className="form" onSubmit={handleSignUpSubmit}>
          <input
            className="input"
            type="text"
            name="name"
            placeholder="Name"
            value={signUpData.name}
            onChange={handleSignUpChange}
            required
          />
          <input
            className="input"
            type="email"
            name="email"
            placeholder="Email"
            value={signUpData.email}
            onChange={handleSignUpChange}
            required
          />
          <input
            className="input"
            type="password"
            name="password"
            placeholder="Password"
            value={signUpData.password}
            onChange={handleSignUpChange}
            required
          />
          <button type="submit" className="button">
            Sign Up
          </button>
        </form>
      )}

      {user && activeTab === 'account' && (
        <>
          <div className="cardContainer">
            <div className="card">
              <h2 className="cardTitle">Account Info</h2>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
            <div className="card">
              <h2 className="cardTitle">Wallet Balance</h2>
              <p className="walletBalance">${user.walletBalance ? user.walletBalance.toFixed(2) : '0.00'}</p>
              <button className="actionButton">Add Funds</button>
            </div>
          </div>
          <h2 className="ordersTitle">Order History</h2>
          <table className="table">
            <thead>
              <tr>
                <th className="th">Order ID</th>
                <th className="th">Date</th>
                <th className="th">Total</th>
                <th className="th">Status</th>
              </tr>
            </thead>
            <tbody>
              {user.orders && user.orders.length > 0 ? (
                user.orders.map(({ id, date, total, status }) => (
                  <tr key={id} className="tr">
                    <td className="td">{id}</td>
                    <td className="td">{date}</td>
                    <td className="td">${total.toFixed(2)}</td>
                    <td className="td">
                      <StatusBadge status={status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="td" colSpan="4">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const statusColors = {
    Delivered: '#4caf50',
    Processing: '#ff9800',
    Cancelled: '#f44336',
  };
  const color = statusColors[status] || '#757575';
  return (
    <span className="statusBadge" style={{ backgroundColor: color }}>
      {status}
    </span>
  );
};

export default UserAccount;
