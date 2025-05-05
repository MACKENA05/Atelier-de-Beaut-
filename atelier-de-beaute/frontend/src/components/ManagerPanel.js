import React, { useEffect, useState } from 'react';
import api from '../services/api';

const ManagerPanel = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        setOrders(response.data);
      } catch (err) {
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Manager Panel</h1>
      <h2>Orders Overview</h2>
      <ul>
        {orders.map(order => (
          <li key={order.id}>
            Order #{order.id} - Customer: {order.user_id} - Total: KES {order.total_price}
          </li>
        ))}
      </ul>
      {/* Add order management UI here */}
    </div>
  );
};

export default ManagerPanel;
