import React, { useState, useEffect } from 'react';

const ManagerPanel = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [summary, setSummary] = useState({
    analyticsSales: 0,
    analyticsGrowth: '',
    ordersCount: 0,
    productsCount: 0,
  });

  useEffect(() => {
    setSummary({
      analyticsSales: 20000,
      analyticsGrowth: '15%',
      ordersCount: 45,
      productsCount: 60,
    });
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'analytics':
        return (
          <div>
            <h3>Analytics</h3>
            <p>Sales: ${summary.analyticsSales}</p>
            <p>Growth: {summary.analyticsGrowth}</p>
          </div>
        );
      case 'orders':
        return <div><h3>Orders List</h3><p>Display orders here.</p></div>;
      case 'products':
        return <div><h3>Products List</h3><p>Display products here.</p></div>;
      default:
        return <div><h3>Welcome to Manager Panel</h3></div>;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <nav style={{ width: '200px', background: '#f0f0f0', padding: '1rem' }}>
        <h2>Manager Panel</h2>
        <div style={{ marginBottom: '1rem' }}>
          <p><strong>Orders:</strong> {summary.ordersCount}</p>
          <p><strong>Products:</strong> {summary.productsCount}</p>
        </div>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li
            style={{ padding: '0.5rem', cursor: 'pointer', background: activeTab === 'analytics' ? '#ddd' : 'transparent' }}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </li>
          <li
            style={{ padding: '0.5rem', cursor: 'pointer', background: activeTab === 'orders' ? '#ddd' : 'transparent' }}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </li>
          <li
            style={{ padding: '0.5rem', cursor: 'pointer', background: activeTab === 'products' ? '#ddd' : 'transparent' }}
            onClick={() => setActiveTab('products')}
          >
            Products
          </li>
        </ul>
      </nav>
      <main style={{ flexGrow: 1, padding: '1rem', overflowY: 'auto' }}>
        {renderTabContent()}
      </main>
    </div>
  );
};

export default ManagerPanel;
