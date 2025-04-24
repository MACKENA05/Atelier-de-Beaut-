import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import UserAccount from './pages/UserAccount';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import Contact from './pages/Contact';
import LandingPage from './pages/LandingPage';
import ProductManagerPage from './pages/ProductManagerPage';
import DeliveryManagerPage from './pages/DeliveryManagerPage';
import { Navigate } from 'react-router-dom';
import PrivacyPolicy from './pages/PrivacyPolicy';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const role = sessionStorage.getItem('userRole');
  if (allowedRoles.includes(role)) {
    return children;
  } else {
    return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main style={{ minHeight: '80vh' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/account" element={<UserAccount />} />
            <Route path="/login" element={<Login />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            

            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['administrator']}>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product-manager"
              element={
                <ProtectedRoute allowedRoles={['product_manager']}>
                  <ProductManagerPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/delivery-manager"
              element={
                <ProtectedRoute allowedRoles={['delivery_manager']}>
                  <DeliveryManagerPage />
                </ProtectedRoute>
              }
            />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
