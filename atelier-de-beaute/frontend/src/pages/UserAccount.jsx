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
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
  });

  const [amountToAdd, setAmountToAdd] = useState('');
  const [addFundsError, setAddFundsError] = useState(null);
  const [localError, setLocalError] = useState(null);

  // New state for popup and payment method
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [popupAmount, setPopupAmount] = useState('');
  const [mpesaNumber, setMpesaNumber] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');

  // New state for profile picture upload
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [uploadingProfilePicture, setUploadingProfilePicture] = useState(false);

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

  // Profile picture upload handler with mock frontend preview
  const handleProfilePictureChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePictureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadProfilePicture = async () => {
    if (!profilePictureFile) {
      toast.error('Please select a file to upload');
      return;
    }
    setUploadingProfilePicture(true);
    try {
      // Mock upload delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Update user profile picture preview locally
      toast.success('Profile picture updated successfully (mock)');
      setProfilePictureFile(null);
    } catch (err) {
      toast.error(err.message || 'Failed to upload profile picture');
    } finally {
      setUploadingProfilePicture(false);
    }
  };

  // Open popup on add funds button click
  const openPaymentPopup = () => {
    if (!amountToAdd || Number(amountToAdd) <= 0) {
      setLocalError('Please enter a valid amount');
      return;
    }
    setPopupAmount(amountToAdd);
    setSelectedPaymentMethod('');
    setMpesaNumber('');
    setPaypalEmail('');
    setAddFundsError(null);
    setLocalError(null);
    setShowPaymentPopup(true);
  };

  const closePaymentPopup = () => {
    setShowPaymentPopup(false);
    setPopupAmount('');
    setSelectedPaymentMethod('');
    setMpesaNumber('');
    setPaypalEmail('');
  };

  const validatePaymentDetails = () => {
    if (selectedPaymentMethod === 'Mpesa') {
      const mpesaRegex = /^\d{10}$/;
      if (!mpesaRegex.test(mpesaNumber)) {
        setAddFundsError('Please enter a valid 10-digit Mpesa number');
        return false;
      }
    } else if (selectedPaymentMethod === 'PayPal') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(paypalEmail)) {
        setAddFundsError('Please enter a valid PayPal email address');
        return false;
      }
    } else {
      setAddFundsError('Please select a payment method');
      return false;
    }
    setAddFundsError(null);
    return true;
  };

  const handleConfirmPayment = async () => {
    if (!validatePaymentDetails()) {
      return;
    }
    try {
      const paymentDetails = {
        amount: Number(popupAmount),
        method: selectedPaymentMethod,
        ...(selectedPaymentMethod === 'Mpesa' ? { mpesaNumber } : {}),
        ...(selectedPaymentMethod === 'PayPal' ? { paypalEmail } : {}),
      };
      await dispatch(addFunds(paymentDetails)).unwrap();
      toast.success('Funds added successfully!');
      setAmountToAdd('');
      closePaymentPopup();
    } catch (err) {
      setAddFundsError(err || 'Failed to add funds');
      toast.error(err || 'Failed to add funds');
    }
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
            type="text"
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
          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
      )}

      {!user && activeTab === 'signup' && (
        <form className="form" onSubmit={handleSignUpSubmit}>
          <input
            className="input"
            type="text"
            name="username"
            placeholder="Username"
            value={signUpData.username}
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
          <input
            className="input"
            type="text"
            name="first_name"
            placeholder="First Name"
            value={signUpData.first_name}
            onChange={handleSignUpChange}
          />
          <input
            className="input"
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={signUpData.last_name}
            onChange={handleSignUpChange}
          />
          <input
            className="input"
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={signUpData.phone}
            onChange={handleSignUpChange}
          />
          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
      )}

      {user && activeTab === 'account' && (
        <>
          <div className="cardContainer">
            <div className="card">
              <h2 className="cardTitle">Account Info</h2>
              {/* Profile Picture Section */}
              <div className="profilePictureSection">
                {profilePicturePreview ? (
                  <img src={profilePicturePreview} alt="Profile Preview" className="profilePicture" />
                ) : user.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" className="profilePicture" />
                ) : (
                  <div className="profilePicturePlaceholder">No Profile Picture</div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  disabled={uploadingProfilePicture}
                  className="profilePictureInput"
                />
                <button
                  className="button"
                  onClick={handleUploadProfilePicture}
                  disabled={uploadingProfilePicture || !profilePictureFile}
                >
                  {uploadingProfilePicture ? 'Uploading...' : 'Upload'}
                </button>
              </div>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
            <div className="card">
              <h2 className="cardTitle">Wallet Balance</h2>
              <p className="walletBalance">
                ${user.walletBalance ? user.walletBalance.toFixed(2) : '0.00'}
              </p>
              <div className="addFundsContainer">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Amount to add"
                  value={amountToAdd}
                  onChange={(e) => setAmountToAdd(e.target.value)}
                  className="addFundsInput"
                />
                <button
                  className="actionButton"
                  onClick={openPaymentPopup}
                  disabled={loading || !amountToAdd || Number(amountToAdd) <= 0}
                >
                  {loading ? 'Processing...' : 'Add Funds'}
                </button>
                {localError && <p className="errorMessage">{localError}</p>}
                {addFundsError && <p className="errorMessage">{addFundsError}</p>}
              </div>
            </div>
          </div>

          {/* Payment Popup */}
          {showPaymentPopup && (
            <div className="paymentPopupOverlay" onClick={closePaymentPopup}>
              <div className="paymentPopup" onClick={(e) => e.stopPropagation()}>
                <h3>Select Payment Method</h3>
                <p>Amount: ${popupAmount}</p>
                <div className="paymentOptions">
                  <label>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Mpesa"
                      checked={selectedPaymentMethod === 'Mpesa'}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    />
                    Mpesa
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="PayPal"
                      checked={selectedPaymentMethod === 'PayPal'}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    />
                    PayPal
                  </label>
                </div>
                {/* Conditional inputs */}
                {selectedPaymentMethod === 'Mpesa' && (
                  <input
                    type="text"
                    placeholder="Enter 10-digit Mpesa number"
                    value={mpesaNumber}
                    onChange={(e) => setMpesaNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    maxLength={10}
                    className="paymentDetailInput"
                  />
                )}
                {selectedPaymentMethod === 'PayPal' && (
                  <input
                    type="email"
                    placeholder="Enter PayPal email"
                    value={paypalEmail}
                    onChange={(e) => setPaypalEmail(e.target.value)}
                    className="paymentDetailInput"
                  />
                )}
                {addFundsError && <p className="errorMessage">{addFundsError}</p>}
                <div className="popupButtons">
                  <button className="button" onClick={handleConfirmPayment} disabled={loading}>
                    {loading ? 'Processing...' : 'Confirm'}
                  </button>
                  <button className="button cancelButton" onClick={closePaymentPopup} disabled={loading}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

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
