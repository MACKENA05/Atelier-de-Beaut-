import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/shop');
    }
  };

  // Removed handleLogout function as it is unused to fix eslint warning

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <NavLink to="/" className="logo-text">Atelier-de-Beaut</NavLink>
      </div>
      <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
        &#9776;
      </button>
      <ul className={`navbar-links ${menuOpen ? 'active' : ''}`}>
        <li><NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuOpen(false)}>Home</NavLink></li>
        <li><NavLink to="/shop" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuOpen(false)}>Shop</NavLink></li>
        <li><NavLink to="/cart" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuOpen(false)}>Cart</NavLink></li>
        <li><NavLink to="/user-account" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuOpen(false)}>Account</NavLink></li>
        <li><NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuOpen(false)}>Contact</NavLink></li>
        {/* Removed Privacy Policy link as requested */}
      </ul>
      <form className="navbar-search" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          aria-label="Search"
        />
      </form>
    </nav>
  );
};

export default Navbar;
