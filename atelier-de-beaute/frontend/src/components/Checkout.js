import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../slice/cartSlice';

const Checkout = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const [address, setAddress] = useState('');
  const [billingInfo, setBillingInfo] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handlePlaceOrder = () => {
    // Simulate payment process and order submission
    if (!address || !billingInfo) {
      alert('Please provide address and billing information.');
      return;
    }
    // Here you would normally call backend API to create order and payment
    setOrderPlaced(true);
    dispatch(clearCart());
  };

  if (orderPlaced) {
    return (
      <div>
        <h1>Order Confirmation</h1>
        <p>Your order has been placed successfully!</p>
        <p>Shipping to: {address}</p>
        <p>Billing Info: {billingInfo}</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return <div>Your cart is empty. Add products before checkout.</div>;
  }

  return (
    <div>
      <h1>Checkout</h1>
      <h2>Total: KES {totalPrice}</h2>
      <div>
        <label>
          Shipping Address:
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows="3" cols="40" />
        </label>
      </div>
      <div>
        <label>
          Billing Information:
          <textarea value={billingInfo} onChange={(e) => setBillingInfo(e.target.value)} rows="3" cols="40" />
        </label>
      </div>
      <button onClick={handlePlaceOrder}>Place Order</button>
    </div>
  );
};

export default Checkout;
