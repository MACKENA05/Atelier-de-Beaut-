import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUserOrders } from '../slice/orderSlice';
import './MyOrders.css';
import './ErrorMessages.css';

const statusClassMap = {
  pending: 'status-pending',
  processing: 'status-processing',
  completed: 'status-completed',
  cancelled: 'status-cancelled',
};

const formatStatus = (status) => {
  if (!status) return 'Unknown';
  const key = status.toLowerCase();
  const className = statusClassMap[key] || '';
  return <span className={className}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
};

const MyOrders = () => {
  const dispatch = useDispatch();
  const ordersState = useSelector((state) => state.orders || {});
  const { orders = [], loading = false, error = null } = ordersState;
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const selectedOrder = orders.find(order => order.id === selectedOrderId);

  if (loading) return <div>Loading your orders...</div>;
  if (error) return <div>Error loading orders: {error}</div>;
  if (!orders.length) return (
    <div className="no-orders-message">
      <p>You have no orders yet.</p>
      <Link to="/shop" className="go-to-shop-link">Go to Shopping</Link>
    </div>
  );
  
  return (
    <div className="my-orders-container">
      <h2>My Orders</h2>
      <ul className="orders-list">
        {orders.map((order) => (
          <li
            key={order.id}
            className={`order-item ${selectedOrderId === order.id ? 'selected' : ''}`}
            onClick={() => setSelectedOrderId(order.id === selectedOrderId ? null : order.id)}
            style={{ cursor: 'pointer' }}
          >
            <div className="order-summary">
              <span className="order-status">{formatStatus(order.order_status)}</span>
              <span className="order-number">Order #{order.id}</span>
              <span className="order-items-count">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
              <span className="order-total">Total: KES {order.total.toFixed(2)}</span>
              <span className="order-date">{new Date(order.created_at).toLocaleString()}</span>
            </div>
            {selectedOrderId === order.id && selectedOrder && (
              <div className="order-details">
                <h4>Shipping Address</h4>
                {selectedOrder.address ? (
                  <div>
                    <p>{selectedOrder.address.full_name}</p>
                    <p>{selectedOrder.address.postal_address}</p>
                    <p>{selectedOrder.address.city}, {selectedOrder.address.country}</p>
                    <p>Phone: {selectedOrder.address.phone}</p>
                  </div>
                ) : (
                  <p>No shipping address available.</p>
                )}
                <h4>Summary of Cost</h4>
                <div>
                <p>Subtotal: KES {(selectedOrder.total - selectedOrder.shipping_cost).toFixed(2)}</p>
                <p>Shipping Cost: KES {selectedOrder.shipping_cost.toFixed(2)}</p>
                <p>Total: KES {selectedOrder.total.toFixed(2)}</p>
                </div>
                <h4>Payment Method</h4>
                <div><p>{selectedOrder.payment_method || 'N/A'}</p></div>
                <h4>Transaction ID</h4>
                <div><p>{selectedOrder.transaction_id || 'N/A'}</p></div>
                <h4>Description</h4>
                <div><p>{selectedOrder.description || 'N/A'}</p></div>
                <h4>Items</h4>
                <div>
                <ul className="order-items-list">
                  {selectedOrder.items.map((item) => (
                    <li key={item.id} className="order-item-detail">
                      <img
                        src={item.product?.image_urls?.[0] || '/default-product.png'}
                        alt={item.product?.name || 'Product'}
                        className="order-item-image"
                      />
                      <span className="order-item-name">{item.product?.name || 'Unnamed product'}</span>
                      <span className="order-item-quantity">Qty: {item.quantity}</span>
                      <span className="order-item-price">KES {item.unit_price.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyOrders;
