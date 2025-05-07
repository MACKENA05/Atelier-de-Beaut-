import React, { useState } from 'react';
import Products from './admin/Products';
import OrdersChart from './charts/OrdersChart';

const SalesRepPanel = () => {
  const [activeTab, setActiveTab] = useState('products');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'products':
        return <Products />;
      case 'orders':
        return <OrdersChart />;
      default:
        return <Products />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <nav style={{ width: '200px', background: '#f0f0f0', padding: '1rem' }}>
        <h2>Sales Representative Panel</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li
            style={{ padding: '0.5rem', cursor: 'pointer', background: activeTab === 'products' ? '#ddd' : 'transparent' }}
            onClick={() => setActiveTab('products')}
          >
            Products
          </li>
          <li
            style={{ padding: '0.5rem', cursor: 'pointer', background: activeTab === 'orders' ? '#ddd' : 'transparent' }}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </li>
        </ul>
      </nav>
      <main style={{ flexGrow: 1, padding: '1rem', overflowY: 'auto' }}>
        {renderTabContent()}
      </main>
    </div>
  );
};

export default SalesRepPanel;