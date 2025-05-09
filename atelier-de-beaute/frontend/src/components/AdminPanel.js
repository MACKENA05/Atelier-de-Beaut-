import React, { useState, useEffect } from 'react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [summary, setSummary] = useState({
    usersCount: 0,
    productsCount: 0,
    invoicesCount: 0,
    sales: 0,
    growth: ''
  });

  useEffect(() => {
    setSummary({
      usersCount: 120,
      productsCount: 58,
      invoicesCount: 34,
      sales: 15000,
      growth: '12%'
    });
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return <div><h3>Users List</h3><p>Display user management here.</p></div>;
      case 'products':
        return <div><h3>Products List</h3><p>Display product management here.</p></div>;
      case 'invoices':
        return <div><h3>Invoices List</h3><p>Display invoices here.</p></div>;
      case 'analytics':
        return (
          <div>
            <h3>Analytics</h3>
            <p>Sales: ${summary.sales}</p>
            <p>Growth: {summary.growth}</p>
          </div>
        );
      default:
        return <div><h3>Welcome to Admin Panel</h3></div>;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <nav style={{ width: '200px', background: '#f0f0f0', padding: '1rem' }}>
        <h2>Admin Panel</h2>
        <div style={{ marginBottom: '1rem' }}>
          <p><strong>Users:</strong> {summary.usersCount}</p>
          <p><strong>Products:</strong> {summary.productsCount}</p>
          <p><strong>Invoices:</strong> {summary.invoicesCount}</p>
        </div>
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
