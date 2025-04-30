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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h3>Categories</h3>
      <ul>
        <li><Link to="/shop?category=skincare">Skincare</Link></li>
        <li><Link to="/shop?category=haircare">Haircare</Link></li>
        <li><Link to="/shop?category=makeup">Makeup</Link></li>
        <li><Link to="/shop?category=fragrance">Fragrance</Link></li>
      </ul>
    </aside>
  );
};

const Slideshow = () => {
  const slides = [
    { id: 1, image: 'https://via.placeholder.com/600x200?text=Promo+1', alt: 'Promo 1' },
    { id: 2, image: 'https://via.placeholder.com/600x200?text=Promo+2', alt: 'Promo 2' },
    { id: 3, image: 'https://via.placeholder.com/600x200?text=Promo+3', alt: 'Promo 3' },
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

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.07;
  const shipping = subtotal > 0 ? 5.99 : 0;
  const discountAmount = subtotal * discount;
  const total = subtotal + tax + shipping - discountAmount;

  return (
    <div className="container-with-sidebar">
      <Sidebar />
      <main className="cart-main">
        <Slideshow />
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
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </main>
    </div>
  );
};

export default Cart;
