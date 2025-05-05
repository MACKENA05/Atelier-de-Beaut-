import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Shop from './components/Shop';
import Footer from './components/Footer';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import AuthPage from './components/AuthPage';

function App() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('');

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterPrice = (priceOrder) => {
    setPriceFilter(priceOrder);
  };

  return (
    <div className="App">
      <Header />
      <Navbar
        onCategorySelect={handleCategorySelect}
        onSearch={handleSearch}
        onFilterPrice={handleFilterPrice}
      />
      <Routes>
        <Route
          path="/"
          element={
            <Shop
              selectedCategoryId={selectedCategoryId}
              searchTerm={searchTerm}
              priceFilter={priceFilter}
            />
          }
        />
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
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
