import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, updateOrder } from '../slice/orderSlice';

const OrdersTable = () => {
  const dispatch = useDispatch();
  const orders = useSelector(state => state.order.orders);
  const loading = useSelector(state => state.order.loading);
  const error = useSelector(state => state.order.error);

  const [editingOrderId, setEditingOrderId] = useState(null);
  const [formData, setFormData] = useState({
    status: ''
  });

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleEditOrder = (order) => {
    setEditingOrderId(order.id);
    setFormData({ status: order.status });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, status: e.target.value });
  };

  const handleUpdateOrder = () => {
    dispatch(updateOrder({ id: editingOrderId, ...formData }));
    setEditingOrderId(null);
    setFormData({ status: '' });
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
            <th>Status</th>
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
                <select value={formData.status} onChange={handleInputChange}>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              ) : order.status}</td>
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
