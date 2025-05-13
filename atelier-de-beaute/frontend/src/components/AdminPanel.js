import React, { useState } from 'react';
import { NavLink, useLocation, cloneElement } from 'react-router-dom';
import './AdminPanel.css';

const AdminPanel = ({ children }) => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  
    const handleSearchChange = (e) => {
      setSearchTerm(e.target.value);
    };
    const isAdminShop = location.pathname === '/admin/shop';
    const childrenWithProps = isAdminShop && React.isValidElement(children)
      ? React.cloneElement(children, { searchTerm })
      : children;
  
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
              Users Management
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/products" className={({ isActive }) => (isActive ? 'active' : '')}>
              Products Management
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/shop" className={({ isActive }) => (isActive ? 'active' : '')}>
              Shop
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/orders" className={({ isActive }) => (isActive ? 'active' : '')}>
              Orders Management
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
      {isAdminShop && (
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ marginBottom: '1rem', padding: '0.5rem', width: '100%', maxWidth: '400px' }}
          />
        )}
        {childrenWithProps}
      </main>
     </div>
   );
 };
 
export default AdminPanel;