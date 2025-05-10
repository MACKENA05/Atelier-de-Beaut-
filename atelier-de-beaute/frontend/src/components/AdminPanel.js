import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

import './AdminPanel.css';

const AdminPanel = ({ children }) => {
  return (
    <div className="admin-panel-container">
      <nav className="admin-sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li>
            <NavLink to="/admin/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/users" className={({ isActive }) => (isActive ? 'active' : '')}>
              Users
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/products" className={({ isActive }) => (isActive ? 'active' : '')}>
              Products
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/shop" className={({ isActive }) => (isActive ? 'active' : '')}>
              Shop
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/orders" className={({ isActive }) => (isActive ? 'active' : '')}>
              Orders
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/invoices" className={({ isActive }) => (isActive ? 'active' : '')}>
              Invoices
            </NavLink>
          </li>
        </ul>
      </nav>
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
};

export default AdminPanel;
