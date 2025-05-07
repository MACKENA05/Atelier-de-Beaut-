import React, { useState } from 'react';
import Analytics from './admin/Analytics';
import OrdersChart from './charts/OrdersChart';
import Products from './admin/Products';
import Invoices from './admin/Invoices';

const ManagerPanel = () => {
  const [activeTab, setActiveTab] = useState('analytics');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'analytics':
        return <Analytics />;
      case 'orders':
        return <OrdersChart />;
      case 'products':
        return <Products />;
      case 'invoices':
        return <Invoices />;
      default:
        return <Analytics />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <nav style={{ width: '200px', background: '#f0f0f0', padding: '1rem' }}>
        <h2>Manager Panel</h2>
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
          <li
            style={{ padding: '0.5rem', cursor: 'pointer', background: activeTab === 'invoices' ? '#ddd' : 'transparent' }}
            onClick={() => setActiveTab('invoices')}
          >
            Invoices
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