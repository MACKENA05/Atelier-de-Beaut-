import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import CartItem from '../components/CartItem';
import CategoryFilter from '../components/CategoryFilter';
import './Cart.css';
import {
  removeFromCart,
  updateQuantity,
  clearCart,
  applyDiscount,
} from '../redux/cartSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import  promoBanner from  '../assets/images/sale banner.jpg'
import  voucherSet from '../assets/images/Cosmetic voucher set.jpg'

const Slideshow = () => {
  const slides = [
    { id: 1, image: promoBanner, alt: 'Promo 1' },
    { id: 2, image: voucherSet, alt: 'Promo 2' },
  ];
  const [current, setCurrent] = useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="slideshow">
      <img src={slides[current].image} alt={slides[current].alt} />
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

  const notify = (message) => toast(message);

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
    notify('Item removed from cart');
  };

  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) return;
    dispatch(updateQuantity({ id, quantity }));
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
        <Slideshow />
        <h1 className="title">Your Shopping Cart</h1>
        {filteredCartItems.length === 0 ? (
          <p className="emptyMessage">Your cart is empty.</p>
        ) : (
          <>
            <div className="cart-items">
              {filteredCartItems.map((item) => (
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
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </main>
    </div>
  );
};

export default Cart;
