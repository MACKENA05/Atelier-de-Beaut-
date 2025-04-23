import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <NavLink to="/" className="logo-text">Atelier-de-Beaut</NavLink>
      </div>
      <ul className="navbar-links">
        <li><NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
        <li><NavLink to="/shop" className={({ isActive }) => isActive ? 'active' : ''}>Shop</NavLink></li>
        <li><NavLink to="/cart" className={({ isActive }) => isActive ? 'active' : ''}>Cart</NavLink></li>
        <li><NavLink to="/account" className={({ isActive }) => isActive ? 'active' : ''}>Account</NavLink></li>
        <li><NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>Contact</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navbar;
