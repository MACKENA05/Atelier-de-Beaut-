import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import store from './slice/store';
import Header from './components/Header';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import AuthPage from './components/AuthPage';
import Shop from './components/Shop';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import AdminPanel from './components/AdminPanel';
import ManagerPanel from './components/ManagerPanel';
import SalesRepPanel from './components/SalesRepPanel';
import ProductDetail from './components/ProductDetail';
import { setUser } from './slice/authSlice';

const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser)));
    }
  }, [dispatch]);

  return (
    <>
      <Header />
      <Navbar />
      <main className="flex-grow p-4">
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/manager" element={<ManagerPanel />} />
          <Route path="/sales-rep" element={<SalesRepPanel />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/" element={<Shop />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen flex flex-col">
          <AppContent />
        </div>
      </Router>
    </Provider>
  );
};

export default App;
