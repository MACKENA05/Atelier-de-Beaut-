import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import CartItem from '../components/CartItem';
import './Cart.css';
import {
  removeFromCart,
  updateQuantity,
  clearCart,
  applyDiscount,
} from '../redux/cartSlice';

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const discount = useSelector((state) => state.cart.discount);
  const dispatch = useDispatch();
  const [discountCode, setDiscountCode] = useState('');
  const [discountError, setDiscountError] = useState('');

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) return;
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleApplyDiscount = () => {
    // Simple example: accept code "SAVE10" for 10% discount
    if (discountCode === 'SAVE10') {
      dispatch(applyDiscount(0.1));
      setDiscountError('');
    } else {
      setDiscountError('Invalid discount code');
    }
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.07; // 7% tax example
  const shipping = subtotal > 0 ? 5.99 : 0;
  const discountAmount = subtotal * discount;
  const total = subtotal + tax + shipping - discountAmount;

  return (
    <div className="container">
      <h1 className="title">Your Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p className="emptyMessage">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={handleRemove}
                onQuantityChange={handleQuantityChange}
              />
            ))}
          </div>
          <div className="cart-actions">
            <button className="clear-cart-button" onClick={handleClearCart}>
              Clear Cart
            </button>
          </div>
          <div className="discount-section">
            <input
              type="text"
              placeholder="Discount code"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              className="discount-input"
            />
            <button onClick={handleApplyDiscount} className="apply-discount-button">
              Apply
            </button>
            {discountError && <p className="discount-error">{discountError}</p>}
          </div>
          <div className="price-summary">
            <p>Subtotal: ${subtotal.toFixed(2)}</p>
            <p>Tax (7%): ${tax.toFixed(2)}</p>
            <p>Shipping: ${shipping.toFixed(2)}</p>
            {discount > 0 && <p>Discount: -${discountAmount.toFixed(2)}</p>}
            <strong>Total: ${total.toFixed(2)}</strong>
          </div>
          <div className="checkout-section">
            <Link to="/checkout" className="checkout-button">
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
