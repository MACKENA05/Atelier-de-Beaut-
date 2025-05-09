import React, { useState, useEffect } from 'react';

const SalesRepPanel = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Simulate fetching orders data
    setOrders([
      { id: 1, customer: 'John Doe', total: 150, status: 'Pending' },
      { id: 2, customer: 'Jane Smith', total: 200, status: 'Completed' },
      { id: 3, customer: 'Alice Johnson', total: 300, status: 'Shipped' },
    ]);
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Sales Representative Panel - Orders</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Order ID</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Customer</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.id}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.customer}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>${order.total}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesRepPanel;
