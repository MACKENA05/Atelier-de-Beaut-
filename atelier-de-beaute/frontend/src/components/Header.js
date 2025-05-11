import React from 'react';
import { Link, useLocation,useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../slice/authSlice';
import { FiLogOut } from 'react-icons/fi';
import './Header.css';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const cartItemsCount = useSelector(state => state.cart.items.length);
  const user = useSelector(state => state.auth.user);
  const hideLinksForRoles = ['admin', 'manager', 'sales-representative'];
  const userRole = user?.role ? user.role.toLowerCase() : '';
  const hideLinks = hideLinksForRoles.includes(userRole);


  const handleLogout = () => {
    dispatch(logout());
    navigate('/', { replace: true });
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
        <div className="header-nav-main">
          {!hideLinks && (
            <>
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/shop" className="nav-link">Shop</Link>
            <Link to="/cart" className="nav-link">
              Cart
              {cartItemsCount > 0 && <span className="cart-count">{cartItemsCount}</span>}
            </Link>
            </>
          )}
          {user && user.role.toLowerCase() === 'customer' && (
            <Link to="/my-orders" className="nav-link">
              My Orders
            </Link>
          )}
          {user && user.role.toLowerCase() === 'admin' && (
            <Link to="/admin" className="nav-link">
              Admin Panel
            </Link>
          )}
          {user && user.role.toLowerCase()=== 'manager' && (
            <Link to="/manager" className='nav-link'>
              Manager Panel 
            </Link>
          )}
          {user && user.role.toLowerCase() === 'sales-representative' && (
            <Link to="/sales-rep" className='nav-link'>Sales-Representative Panel</Link>
          )}
        </div>
        <div className="header-nav-auth">
          {user ? (
            <>
              <span className="nav-link">Hello, {user.username}</span>
              <button onClick={handleLogout} className="nav-link logout-button"><FiLogOut size={18} style={{ verticalAlign: 'middle', marginRight: '6px' }} /> Logout</button>
            </>
          ) : (
            <Link to="/auth" state={{ from: location }} className="nav-link">🔐 Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
