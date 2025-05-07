import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart, fetchCart, clearCartBackend, removeFromCartBackend } from '../slice/cartSlice';
import { FaTrashAlt } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import './Cart.css';
import './ErrorMessages.css';
import ConfirmDialog from './ConfirmDialog';
import './ConfirmDialog.css';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(state => state.cart.items);
  const cartStatus = useSelector(state => state.cart.status);
  const cartError = useSelector(state => state.cart.error);
  const isAuthenticated = useSelector(state => state.auth.authenticated);

  const deduplicatedCartItems = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const existing = acc.find(i => i.id === item.id);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        acc.push({ ...item });
      }
      return acc;
    }, []);
  }, [cartItems]);

  const [imageUrls, setImageUrls] = useState({});
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  const handleRemove = (id) => {
    if (isAuthenticated) {
      dispatch(removeFromCartBackend(id));
    } else {
      dispatch(removeFromCart(id));
    }
  };
  

  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) return;
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleClearCart = () => {
    setShowConfirmClear(true);
  };

  const confirmClearCart = async () => {
    if (isAuthenticated) {
      try {
        await dispatch(clearCartBackend());
        await dispatch(fetchCart());
      } catch (error) {
        console.error('Failed to clear backend cart:', error);
      }
    } else {
      dispatch(clearCart());
    }
    setShowConfirmClear(false);
  };

  const cancelClearCart = () => {
    setShowConfirmClear(false);
  };

  const handleProceedToCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login', { state: { from: '/checkout' } });
    }
  };

  // Calculate total price using discount_price if available and less than original price
  const totalPrice = deduplicatedCartItems.reduce((total, item) => {
    const price = item.discount_price && item.discount_price < item.price ? item.discount_price : item.price;
    return total + price * item.quantity;
  }, 0);


  const getImageUrl = (urls) => {
    const placeholderImage = 'https://via.placeholder.com/150';
    if (!urls) return placeholderImage;

    let cleanUrl = '';
    if (Array.isArray(urls) && urls.length > 0) {
      cleanUrl = urls[0];
    } else if (typeof urls === 'string') {
      try {
        const parsedUrls = JSON.parse(urls);
        cleanUrl = Array.isArray(parsedUrls) && parsedUrls.length > 0 ? parsedUrls[0] : urls;
      } catch {
        cleanUrl = urls;
      }
    }

    if (!cleanUrl || !cleanUrl.startsWith('http')) {
      return placeholderImage;
    }
    return cleanUrl;
  };

  useEffect(() => {
    const newImageUrls = {};
    deduplicatedCartItems.forEach(item => {
      const resolvedUrl = getImageUrl(item.image_urls || item.image_url);
      newImageUrls[item.id] = resolvedUrl;
    });
    setImageUrls(newImageUrls);
  }, [deduplicatedCartItems]);

  if (cartStatus === 'loading') {
    return <div className="cart-loading">Loading cart...</div>;
  }

  if (cartError) {
    return (
      <div className="cart-error">
        Error loading cart: {cartError}
        <br />
        <button onClick={() => dispatch(fetchCart())}>Retry</button>
        <Link to="/shop" className="continue-shopping-button-empty">Continue Shopping</Link>
      </div>
    );
  }

  if (deduplicatedCartItems.length === 0) {
    return (
      <div className="empty-cart">
        Your cart is empty.
        <br />
        <Link to="/shop" className="continue-shopping-button-empty">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-container-with-image">
      <div className="cart-container">
        <h1>Your Cart</h1>
        {deduplicatedCartItems
          .filter(item => {
            if (!item.id) {
              console.warn('Cart item missing id:', item);
              return false;
            }
            return true;
          })
          .map((item) => {
            const imageUrl = imageUrls[item.id] || '/assets/default-product.png';
            const hasDiscount = item.discount_price && item.discount_price < item.price;
            return (
              <div key={item.id} className="cart-item">
                <img
                  src={imageUrl}
                  alt={item.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  {hasDiscount ? (
                    <p>
                      <span style={{ textDecoration: 'line-through', color: 'red', marginRight: '8px' }}>
                        KES {item.price.toFixed(2)}
                      </span>
                      <span style={{ fontWeight: 'bold', color: 'green' }}>
                        KES {item.discount_price.toFixed(2)}
                      </span>
                    </p>
                  ) : (
                    <p>Price: KES {item.price.toFixed(2)}</p>
                  )}
                  <p>
                    Quantity: 
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                      min="1"
                    />
                  </p>
                </div>
                <button className="remove-button" onClick={() => handleRemove(item.id)} aria-label="Remove item">
                  <FaTrashAlt />
                </button>
              </div>
            );
          })}
        <h2 className="cart-total">Total: KES {totalPrice.toFixed(2)}</h2>
        <button className="clear-cart-button" onClick={handleClearCart}>Clear Cart</button>
        <div className="cart-actions">
          <button className="proceed-checkout-button" onClick={handleProceedToCheckout}>Proceed to Checkout</button>
          <Link to="/shop" className="continue-shopping-button">Continue Shopping</Link>
        </div>
      </div>
      {showConfirmClear && (
        <ConfirmDialog
          message="Are you sure you want to clear the cart?"
          onConfirm={confirmClearCart}
          onCancel={cancelClearCart}
        />
      )}
    </div>
  );
};

export default Cart;
