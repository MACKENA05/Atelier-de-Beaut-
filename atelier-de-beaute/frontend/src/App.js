import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './slice/authSlice';
import { loadCartFromStorage, setAuthenticated } from './slice/cartSlice';
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
import AdminDashboard from './components/AdminDashboard';
import AdminPanel from './components/AdminPanel';
import SalesRepPanel from './components/SalesRepPanel';
import ManagerPanel from './components/ManagerPanel';
import MyOrders from './components/MyOrders';
import UsersTable from './components/UsersTable';
import ProductsTable from './components/ProductsTable';
import ShopDisplay from './components/ShopDisplay';
import OrdersTable from './components/OrdersTable';
import ReviewsTable from './components/ReviewsTable';
import InvoicesTable from './components/InvoicesTable';


function ProtectedRoute({ children, allowedRoles }) {
  const user = useSelector(state => state.auth.user);
  console.log('ProtectedRoute user:', user);
  console.log('ProtectedRoute user role:', user?.role);
  if (!user || !allowedRoles.includes(user.role.toLowerCase())) {
  return ;
  }
  return children;
  }


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

  const isAuthenticated = useSelector(state => state.auth.authenticated);

  useEffect(() => {
    dispatch(setAuthenticated(isAuthenticated));
  }, [isAuthenticated, dispatch]);

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
        <Route
          path="/admin"
          element={<Navigate to="/admin/dashboard" replace />}
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPanel>
                <AdminDashboard />
              </AdminPanel>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPanel>
                <UsersTable />
              </AdminPanel>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPanel>
                <ProductsTable />
              </AdminPanel>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/shop"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPanel>
                <Shop/>
              </AdminPanel>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPanel>
                <OrdersTable />
              </AdminPanel>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/invoices"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPanel>
                <InvoicesTable />
              </AdminPanel>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales-rep"
          element={
            <ProtectedRoute allowedRoles={['sales-representative']}>
              <SalesRepPanel>
                <OrdersTable/>
              </SalesRepPanel>
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager"
          element={
            <ProtectedRoute allowedRoles={['manager']}>
              <ManagerPanel />
            </ProtectedRoute>
          }
        />
        <Route path="/my-orders" element={<MyOrders />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;