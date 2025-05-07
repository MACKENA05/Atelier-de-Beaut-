import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const OrdersChart = () => {
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
      <h3>Orders</h3>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Order Number</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Item Name</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Number of Items</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Shipping Address</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Shipping Date</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Full Name</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total Amount</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Payment Status</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Delivery Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <React.Fragment key={order.id}>
                {order.items.map(item => (
                  <tr key={item.product_id}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.id}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.product.name}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.quantity}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      {order.address.postal_address}, {order.address.city}, {order.address.country}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.address.full_name}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>KES {order.total}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.payment_status}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.delivery_status}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrdersChart;
