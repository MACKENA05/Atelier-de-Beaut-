import React, { useState } from 'react';
import Users from './admin/Users';
import Products from './admin/Products';
import Invoices from './admin/Invoices';
import Analytics from './admin/Analytics';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return <Users />;
      case 'products':
        return <Products />;
      case 'invoices':
        return <Invoices />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Users />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <nav style={{ width: '200px', background: '#f0f0f0', padding: '1rem' }}>
        <h2>Admin Panel</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li
            style={{ padding: '0.5rem', cursor: 'pointer', background: activeTab === 'users' ? '#ddd' : 'transparent' }}
            onClick={() => setActiveTab('users')}
          >
            Users
          </li>
          <li
            style={{ padding: '0.5rem', cursor: 'pointer', background: activeTab === 'products' ? '#ddd' : 'transparent' }}
            onClick={() => setActiveTab('products')}
          >
            Products
          </li>
          <li
            style={{ padding: '0.5rem', cursor: 'pointer', background: activeTab === 'invoices' ? '#ddd' : 'transparent' }}
            onClick={() => setActiveTab('invoices')}
          >
            Invoices
          </li>
          <li
            style={{ padding: '0.5rem', cursor: 'pointer', background: activeTab === 'analytics' ? '#ddd' : 'transparent' }}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </li>
        </ul>
      </nav>
      <main style={{ flexGrow: 1, padding: '1rem', overflowY: 'auto' }}>
        {renderTabContent()}
      </main>
    </div>
  );
};

export default AdminPanel;