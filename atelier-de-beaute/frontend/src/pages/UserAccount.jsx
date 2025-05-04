import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { login, signup, logout, fetchCurrentUser, addFunds } from '../redux/authSlice';
import { toast } from 'react-toastify';
import './UserAccount.css';
import luxuryCreamImage from '../assets/images/Luxury cream.jpg';

const UserAccount = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('login');

  // State Management
  const [formData, setFormData] = useState({
    login: { email: '', password: '' },
    signup: {
      username: '', email: '', password: '', first_name: '', last_name: '', phone: '',
    },
    addFunds: { amount: '', mpesaNumber: '', paypalEmail: '' },
    paymentPopup: { show: false, method: '', amount: '' },
  });

  const [localError, setLocalError] = useState(null);
  const [addFundsError, setAddFundsError] = useState(null);

  // Error Toast Notifications
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // Fetch current user on load
  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    setActiveTab(user ? 'account' : 'login');
  }, [user]);

  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData.login));
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    dispatch(signup(formData.signup));
  };

  const handleLogout = () => {
    dispatch(logout());
    setFormData({
      login: { email: '', password: '' },
      signup: { username: '', email: '', password: '', first_name: '', last_name: '', phone: '' },
      addFunds: { amount: '', mpesaNumber: '', paypalEmail: '' },
      paymentPopup: { show: false, method: '', amount: '' },
    });
  };

  // Add Funds Popup Handler
  const openPaymentPopup = () => {
    if (!formData.addFunds.amount || Number(formData.addFunds.amount) <= 0) {
      setLocalError('Please enter a valid amount');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      paymentPopup: { ...prev.paymentPopup, show: true, amount: formData.addFunds.amount },
    }));
    setLocalError(null);
  };

  const closePaymentPopup = () => {
    setFormData((prev) => ({
      ...prev,
      paymentPopup: { show: false, method: '', amount: '' },
    }));
  };

  const validatePaymentDetails = () => {
    const { method, mpesaNumber, paypalEmail } = formData.addFunds;
    if (method === 'Mpesa' && !/^\d{10}$/.test(mpesaNumber)) {
      setAddFundsError('Please enter a valid 10-digit Mpesa number');
      return false;
    }
    if (method === 'PayPal' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paypalEmail)) {
      setAddFundsError('Please enter a valid PayPal email address');
      return false;
    }
    if (!method) {
      setAddFundsError('Please select a payment method');
      return false;
    }
    setAddFundsError(null);
    return true;
  };

  const handleConfirmPayment = async () => {
    if (!validatePaymentDetails()) return;

    try {
      const paymentDetails = {
        amount: Number(formData.paymentPopup.amount),
        method: formData.addFunds.method,
        ...(formData.addFunds.method === 'Mpesa' ? { mpesaNumber: formData.addFunds.mpesaNumber } : {}),
        ...(formData.addFunds.method === 'PayPal' ? { paypalEmail: formData.addFunds.paypalEmail } : {}),
      };
      await dispatch(addFunds(paymentDetails)).unwrap();
      toast.success('Funds added successfully!');
      setFormData((prev) => ({ ...prev, addFunds: { amount: '', mpesaNumber: '', paypalEmail: '' } }));
      closePaymentPopup();
    } catch (err) {
      setAddFundsError(err.message || 'Failed to add funds');
      toast.error(err.message || 'Failed to add funds');
    }
  };

  return (
    <div className="container" style={{ backgroundImage: `url(${luxuryCreamImage})` }}>
      <h1 className="title">User Account</h1>
      <div className="tabContainer">
        {!user && (
          <>
            <button className={activeTab === 'login' ? 'activeTabButton' : 'tabButton'} onClick={() => setActiveTab('login')}>Login</button>
            <button className={activeTab === 'signup' ? 'activeTabButton' : 'tabButton'} onClick={() => setActiveTab('signup')}>Sign Up</button>
          </>
        )}
        {user && (
          <button className="logoutButton" onClick={handleLogout}>Logout</button>
        )}
      </div>

      {loading && <p>Loading...</p>}

      {/* Login Form */}
      {!user && activeTab === 'login' && (
        <form className="form" onSubmit={handleLoginSubmit}>
          <input className="input" type="email" name="email" placeholder="Email" value={formData.login.email} onChange={(e) => handleInputChange('login', 'email', e.target.value)} required />
          <input className="input" type="password" name="password" placeholder="Password" value={formData.login.password} onChange={(e) => handleInputChange('login', 'password', e.target.value)} required />
          <button type="submit" className="button" disabled={loading}>{loading ? 'Logging in...' : 'Log In'}</button>
        </form>
      )}

      {/* Sign Up Form */}
      {!user && activeTab === 'signup' && (
        <form className="form" onSubmit={handleSignUpSubmit}>
          {Object.keys(formData.signup).map((field) => (
            <input
              key={field}
              className="input"
              type="text"
              name={field}
              placeholder={field.replace('_', ' ').toUpperCase()}
              value={formData.signup[field]}
              onChange={(e) => handleInputChange('signup', field, e.target.value)}
            />
          ))}
          <button type="submit" className="button" disabled={loading}>{loading ? 'Signing up...' : 'Sign Up'}</button>
        </form>
      )}

      {/* User Account Section */}
      {user && activeTab === 'account' && (
        <>
          <div className="cardContainer">
            {/* Account Info */}
            <div className="card">
              <h2 className="cardTitle">Account Info</h2>
              <div className="profileInfo">
                <p>Name: {user.first_name} {user.last_name}</p>
                <p>Email: {user.email}</p>
                <p>Phone: {user.phone}</p>
              </div>
            </div>

            {/* Add Funds Section */}
            <div className="card">
              <h2 className="cardTitle">Add Funds</h2>
              <input
                className="input"
                type="number"
                placeholder="Amount"
                value={formData.addFunds.amount}
                onChange={(e) => handleInputChange('addFunds', 'amount', e.target.value)}
              />
              <button onClick={openPaymentPopup} className="button">Add Funds</button>
            </div>
          </div>
        </>
      )}

      {/* Payment Popup */}
      {formData.paymentPopup.show && (
        <div className="popup">
          <div className="popupContent">
            <h2>Add Funds</h2>
            <div className="popupBody">
              <button onClick={() => handleInputChange('addFunds', 'method', 'Mpesa')} className="popupButton">
                Pay with Mpesa
              </button>
              <button onClick={() => handleInputChange('addFunds', 'method', 'PayPal')} className="popupButton">
                Pay with PayPal
              </button>
              <button onClick={closePaymentPopup} className="popupCloseButton">Close</button>
            </div>
            {addFundsError && <div className="error">{addFundsError}</div>}
            {formData.addFunds.method && (
              <>
                <input
                  className="input"
                  type="text"
                  placeholder={formData.addFunds.method === 'Mpesa' ? 'Enter Mpesa Number' : 'Enter PayPal Email'}
                  value={formData.addFunds.method === 'Mpesa' ? formData.addFunds.mpesaNumber : formData.addFunds.paypalEmail}
                  onChange={(e) => handleInputChange('addFunds', formData.addFunds.method === 'Mpesa' ? 'mpesaNumber' : 'paypalEmail', e.target.value)}
                />
                <button onClick={handleConfirmPayment} className="popupConfirmButton">Confirm Payment</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAccount;
