import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../slice/authSlice';
import './Header.css';

const Header = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const cartItemsCount = useSelector(state => state.cart.items.length);
  const user = useSelector(state => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="header-logo">
          <img src="/logo1.jpg" alt="Logo" className="logo-image" />
          <span className="site-name">Atelier de Beauté</span>
        </Link>
      </div>
      <nav className="header-nav">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/shop" className="nav-link">Shop</Link>
        <Link to="/cart" className="nav-link">
          Cart
          {cartItemsCount > 0 && <span className="cart-count">{cartItemsCount}</span>}
        </Link>
        {user ? (
          <>
            <span className="nav-link">Hello, {user.username}</span>
            <button onClick={handleLogout} className="nav-link logout-button">Logout</button>
          </>
        ) : (
          <Link to="/auth" state={{ from: location }} className="nav-link">Login</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
