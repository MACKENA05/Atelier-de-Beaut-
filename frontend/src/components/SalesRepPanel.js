import React, { useState } from 'react';
import OrdersTable from './OrdersTable';
import Shop from './Shop';
import './SalesRepPanel.css';

const SalesRepPanel = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [searchTerm, setSearchTerm] = useState('');
 
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'orders':
        return <OrdersTable />;
      case 'shop':
        return <div>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ marginBottom: '1rem', padding: '0.5rem', width: '100%', maxWidth: '400px' }}
          />
          <Shop searchTerm={searchTerm} />
        </div>;
      default:
        return <OrdersTable />;
    }
  };

  return (
    <div className="salesrep-panel">
      <nav className="salesrep-nav">
        <h2>Sales Rep Panel</h2>
        <ul>
          <li
            className={activeTab === 'orders' ? 'active' : ''}
            onClick={() => setActiveTab('orders')}
          >
            Orders Management
          </li>
          <li
            className={activeTab === 'shop' ? 'active' : ''}
            onClick={() => setActiveTab('shop')}
          >
            Shop
          </li>
        </ul>
      </nav>
      <main className="salesrep-main">
        {renderTabContent()}
      </main>
    </div>
  );
};

export default SalesRepPanel;
