import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from './redux/authSlice';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import AdministratorPanel from './pages/AdministratorPanel';
import ProductManagerPanel from './pages/ProductManagerPanel';
import DeliveryManagerPanel from './pages/DeliveryManagerPanel';
import LandingPage from './pages/LandingPage';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CreateAccount from './pages/CreateAccount';
import UserAccount from './pages/UserAccount';
import Contact from './pages/Contact';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import LoginForm from './components/LoginForm';
import ProtectedRoute from './components/ProtectedRoute';

import AdminDashboard from './pages/AdminDashboard';
import StoreManagerPage from './pages/StoreManagerPage';
import SalesRepPage from './pages/SalesRepPage';
import NotAuthorized from './pages/NotAuthorized';

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdministratorPanel />} />
        <Route path="/not-authorized" element={<NotAuthorized />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/store-manager"
          element={
            <ProtectedRoute allowedRoles={['store_manager']}>
              <StoreManagerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/sales-rep"
          element={
            <ProtectedRoute allowedRoles={['sales_rep']}>
              <SalesRepPage />
            </ProtectedRoute>
          }
        />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/product-manager" element={<ProductManagerPanel />} />
        <Route path="/delivery-manager" element={<DeliveryManagerPanel />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/user-account" element={<UserAccount />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
        <Footer />
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </AuthProvider>
    </Router>
  );
}

export default App;
