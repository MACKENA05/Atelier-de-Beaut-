import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, updateOrder } from '../slice/orderSlice';

const paymentStatusOptions = [
  'initiated',
  'pending',
  'completed',
  'failed'
];

const deliveryStatusOptions = [
  'pending',
  'shipped',
  'delivered'
];

const OrdersTable = () => {
  const dispatch = useDispatch();
  const orders = useSelector(state => state.orders.orders);
  const loading = useSelector(state => state.orders.loading);
  const error = useSelector(state => state.orders.error);

  const [editingOrderId, setEditingOrderId] = useState(null);
  const [formData, setFormData] = useState({
    payment_status: '',
    delivery_status: ''
  });

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleEditOrder = (order) => {
    setEditingOrderId(order.id);
    setFormData({ 
      payment_status: order.payment_status || '',
      delivery_status: order.delivery_status || ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateOrder = () => {
    dispatch(updateOrder({ id: editingOrderId, ...formData }));
    setEditingOrderId(null);
    setFormData({ payment_status: '', delivery_status: '' });
  };

  return (
    <div>
      <h2>Orders</h2>
      {loading && <p>Loading orders...</p>}
      {error && <p style={{color: 'red'}}>Error: {error}</p>}
      <table border="1" cellPadding="8" cellSpacing="0" style={{width: '100%', marginBottom: '1rem'}}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Total</th>
            <th>Payment Status</th>
            <th>Delivery Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders && orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.user?.username || order.user?.email || 'N/A'}</td>
              <td>${order.total}</td>
              <td>{editingOrderId === order.id ? (
                <select name="payment_status" value={formData.payment_status} onChange={handleInputChange}>
                  {paymentStatusOptions.map(status => (
                    <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                  ))}
                </select>
              ) : order.payment_status}</td>
              <td>{editingOrderId === order.id ? (
                <select name="delivery_status" value={formData.delivery_status} onChange={handleInputChange}>
                  {deliveryStatusOptions.map(status => (
                    <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                  ))}
                </select>
              ) : order.delivery_status}</td>
              <td>
                {editingOrderId === order.id ? (
                  <>
                    <button onClick={handleUpdateOrder}>Save</button>
                    <button onClick={() => setEditingOrderId(null)}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => handleEditOrder(order)}>Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
