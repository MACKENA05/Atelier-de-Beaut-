import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, updateOrder } from '../slice/orderSlice';
import { toast } from 'react-toastify';
import { FaEdit } from 'react-icons/fa';
import './OrdersTable.css';

const paymentStatusOptions = [
  'initiated',
  'pending',
  'completed',
  'failed'
];

const deliveryStatusOptions = [
  'pending',
  'shipped',
  'delivered',
];

const OrdersTable = () => {
  const dispatch = useDispatch();
  const ordersData = useSelector(state => state.orders.orders);
  const loading = useSelector(state => state.orders.loading);
  const error = useSelector(state => state.orders.error);

  const [editingOrderId, setEditingOrderId] = useState(null);
  const [formData, setFormData] = useState({
    payment_status: '',
    delivery_status: ''
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    dispatch(fetchOrders({ page: currentPage }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (ordersData && ordersData.pages) {
      setTotalPages(ordersData.pages);
    }
  }, [ordersData]);

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

  const handleUpdateOrder = async () => {
    try {
      await dispatch(updateOrder({ id: editingOrderId, ...formData })).unwrap();
      toast.success('Order updated successfully');
      setEditingOrderId(null);
      setFormData({ payment_status: '', delivery_status: '' });
      dispatch(fetchOrders({ page: currentPage }));
    } catch (err) {
      toast.error(`Failed to update order: ${err}`);
    }
  };

  const getStatusClass = (status) => {
    if (!status) return '';
    return `status-${status.toLowerCase()}`;
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const orders = ordersData ? ordersData.items : [];

  return (
    <div className="OrdersTable-container">
      <h2>Orders</h2>
      {loading && <p className="OrdersTable-loading">Loading orders...</p>}
      {error && <p className="OrdersTable-error">Error: {error}</p>}
      <table className="OrdersTable-table" border="1" cellPadding="8" cellSpacing="0">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Username</th>
            <th>Phone Number</th>
            <th>No. of Items</th>
            <th>Total Amount</th>
            <th>Payment Status</th>
            <th>Delivery Status</th>
            <th>Shipping Method</th>
            <th>Payment Method</th>
            <th>Order Description</th>
            <th>Transaction ID</th>
            <th>Order Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders && orders.map(order => {
            const numberOfItems = order.items ? order.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
            return (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user?.username || order.user?.email || 'N/A'}</td>
                <td>{order.address?.phone || 'N/A'}</td>
                <td>{numberOfItems}</td>
                <td>KES {order.total}</td>
                <td className={getStatusClass(order.payment_status)}>
                  {editingOrderId === order.id ? (
                    <select name="payment_status" value={formData.payment_status} onChange={handleInputChange}>
                      {paymentStatusOptions.map(status => (
                        <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                      ))}
                    </select>
                  ) : order.payment_status}
                </td>
                <td className={getStatusClass(order.delivery_status)}>
                  {editingOrderId === order.id ? (
                    <select name="delivery_status" value={formData.delivery_status} onChange={handleInputChange}>
                      {deliveryStatusOptions.map(status => (
                        <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                      ))}
                    </select>
                  ) : order.delivery_status}
                </td>
                <td>{order.shipping_method}</td>
                <td>{order.payment_method}</td>
                <td>{order.description}</td>
                <td>{order.transaction_id || 'N/A'}</td>
                <td className={getStatusClass(order.order_status)}>{order.order_status || 'N/A'}</td>
                <td>
                  {editingOrderId === order.id ? (
                    <>
                      <button className="OrdersTable-button" onClick={handleUpdateOrder}>Save</button>
                      <button className="OrdersTable-button" onClick={() => setEditingOrderId(null)}>Cancel</button>
                    </>
                  ) : (
                    <button className="OrdersTable-button" onClick={() => handleEditOrder(order)} title="Edit Order">
                      <FaEdit />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="OrdersTable-pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
        <span> Page {currentPage} of {totalPages} </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
};

export default OrdersTable;
