import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import CartItem from '../components/CartItem';
import CategoryFilter from '../components/CategoryFilter';
import './Cart.css';
import {
  removeFromCartThunk,
  updateQuantityThunk,
  clearCart,
  applyDiscount,
  fetchCartThunk,
} from '../redux/cartSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import luxuryCream from '../assets/images/Luxury cream.jpg';
import silkHairSerum from '../assets/images/silk hair serum.jpg';

const Slideshow = () => {
  const slides = [
    { id: 1, image: luxuryCream, alt: 'Luxury Cream' },
    { id: 2, image: silkHairSerum, alt: 'Silk Hair Serum' },
  ];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000); // slower transition: 8 seconds
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="slideshow">
      <img
        src={slides[current].image}
        alt={slides[current].alt}
        className="slideshow-image"
      />
    </div>
  );
};

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const discount = useSelector((state) => state.cart.discount);
  const dispatch = useDispatch();
  const [discountCode, setDiscountCode] = useState('');
  const [discountError, setDiscountError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    dispatch(fetchCartThunk());
  }, [dispatch]);

  const notify = (message) => toast(message);

  const handleRemove = (id) => {
    dispatch(removeFromCartThunk(id));
    notify('Item removed from cart');
  };

  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) return;
    dispatch(updateQuantityThunk({ id, quantity }));
    notify('Cart updated');
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    notify('Cart cleared');
  };

  const handleApplyDiscount = () => {
    if (discountCode === 'SAVE10') {
      dispatch(applyDiscount(0.1));
      setDiscountError('');
      notify('Discount applied');
    } else {
      setDiscountError('Invalid discount code');
      notify('Invalid discount code');
    }
  };

  const filteredCartItems = selectedCategory
    ? cartItems.filter((item) => item.category === selectedCategory)
    : cartItems;

  const subtotal = filteredCartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.07;
  const shipping = subtotal > 0 ? 5.99 : 0;
  const discountAmount = subtotal * discount;
  const total = subtotal + tax + shipping - discountAmount;

  return (
    <div className="container-with-filterbar">
      <CategoryFilter
        categories={['Skincare', 'Haircare', 'Makeup', 'Fragrance']}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <main className="cart-main">
        <div className="cart-items">
          <h1 className="title">Your Shopping Cart</h1>
          {filteredCartItems.length === 0 ? (
            <p className="emptyMessage">Your cart is empty.</p>
          ) : (
            filteredCartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={handleRemove}
                onQuantityChange={handleQuantityChange}
              />
            ))
          )}
          <div className="cart-actions">
            <button className="clear-cart-button" onClick={handleClearCart}>
              Clear Cart
            </button>
          </div>
        </div>
        <div>
          <Slideshow />
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
        </div>
      </main>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default Cart;
