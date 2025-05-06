import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './slice/authSlice';
import { loadCartFromStorage } from './slice/cartSlice';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Shop from './components/Shop';
import Footer from './components/Footer';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Account from './components/Account';
import Contact from './components/Contact';
import PrivacyPolicy from './components/PrivacyPolicy';
import AuthPage from './components/AuthPage';
import LandingPage from './components/LandingPage';

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser)));
    } else {
      // Load guest cart from localStorage if no user logged in
      dispatch(loadCartFromStorage());
    }
  }, [dispatch]);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterPrice = (priceOrder) => {
    setPriceFilter(priceOrder);
  };

  const isLandingPage = location.pathname === '/';

  return (
    <div className="App">
      <Header />
      {location.pathname === '/shop' && (
        <Navbar
          onCategorySelect={handleCategorySelect}
          onSearch={handleSearch}
          onFilterPrice={handleFilterPrice}
        />
      )}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/shop"
          element={
            <Shop
              selectedCategoryId={selectedCategoryId}
              searchTerm={searchTerm}
              priceFilter={priceFilter}
            />
          }
        />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<Navigate to="/auth" replace />} />
        <Route path="/account" element={<Account />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
