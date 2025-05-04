import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import './Navbar.css';
import logoImage from '../assets/images/logo_atelier.png';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const { user } = auth;

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    sessionStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logoImage} alt="Logo" className="logo-image" />
        <div className="logo-text">Atelier-de-beaute</div>
      </div>
      <div className="menu-toggle" onClick={toggleMenu}>
        ☰
      </div>
      
      <div className={`navbar-right ${menuOpen ? 'active' : ''}`}>
        <NavLink to="/" onClick={() => setMenuOpen(false)}>HOME</NavLink>
        <NavLink to="/shop" onClick={() => setMenuOpen(false)}>SHOP</NavLink>
        <NavLink to="/contact" onClick={() => setMenuOpen(false)}>CONTACT</NavLink>
        {user && (
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>

      <div className="icon-links">
        <NavLink to="/cart" aria-label="Cart">
          <FaShoppingCart className="nav-icon cart" />
        </NavLink>
        <NavLink to="/user-account" aria-label="User Account">
          <FaUser className="nav-icon user" />
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
