import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdministratorPanel />} />
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
    </Router>
  );
}

export default App;
