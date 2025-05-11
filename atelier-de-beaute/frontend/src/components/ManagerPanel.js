import React, { useState } from 'react';
import ProductsTable from './ProductsTable';
import OrdersTable from './OrdersTable';
import Shop from './Shop';
import './ManagerPanel.css';

const ManagerPanel = () => {
  const [activeTab, setActiveTab] = useState('products');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'products':
        return <ProductsTable />;
      case 'orders':
        return <OrdersTable />;
      case 'shop':
        return <Shop />;
      default:
        return <ProductsTable />;
    }
  };

  return (
    <div className="manager-panel">
      <nav className="manager-nav">
        <h2>Manager Panel</h2>
        <ul>
          <li
            className={activeTab === 'products' ? 'active' : ''}
            onClick={() => setActiveTab('products')}
          >
            Products
          </li>
          <li
            className={activeTab === 'orders' ? 'active' : ''}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </li>
          <li
            className={activeTab === 'shop' ? 'active' : ''}
            onClick={() => setActiveTab('shop')}
          >
            Shop
          </li>
        </ul>
      </nav>
      <main className="manager-main">
        {renderTabContent()}
      </main>
    </div>
  );
};

export default ManagerPanel;
