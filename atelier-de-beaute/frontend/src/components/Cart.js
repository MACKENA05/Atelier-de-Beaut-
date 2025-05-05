import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../slice/cartSlice';
import { FaTrashAlt } from 'react-icons/fa';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(state => state.cart.items);
  const isAuthenticated = useSelector(state => state.auth.authenticated);

  // State to store resolved image URLs to prevent re-render loops
  const [imageUrls, setImageUrls] = useState({});

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) return;
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear the cart?')) {
      dispatch(clearCart());
    }
  };

  const handleProceedToCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login');
    }
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const getImageUrl = (url, itemId) => {
    const defaultImage = '/assets/default-product.png';
    if (!url) {
      console.log(`Item ${itemId}: No image URL provided, using default: ${defaultImage}`);
      return defaultImage;
    }

    let cleanUrl = url;

    // Handle potential JSON string from local storage (e.g., '"/images/product.jpg"' or '["/images/product.jpg"]')
    if (typeof url === 'string') {
      // Try parsing as JSON array
      if (url.startsWith('[') && url.endsWith(']')) {
        try {
          const parsedUrls = JSON.parse(url);
          if (Array.isArray(parsedUrls) && parsedUrls.length > 0) {
            cleanUrl = parsedUrls[0];
            console.log(`Item ${itemId}: Parsed JSON array to URL: ${cleanUrl}`);
          } else {
            console.log(`Item ${itemId}: Parsed JSON array is empty, using default: ${defaultImage}`);
            return defaultImage;
          }
        } catch (e) {
          console.error(`Item ${itemId}: Failed to parse JSON: ${e}, treating as string`);
          // Try removing extra quotes from potential string encoding
          cleanUrl = url.replace(/^"|"$/g, '');
        }
      }
    } else {
      console.log(`Item ${itemId}: Unexpected image_url type (${typeof url}), using default: ${defaultImage}`);
      return defaultImage;
    }

    // If the URL is absolute (starts with http or data:), return it as is
    if (cleanUrl.startsWith('http') || cleanUrl.startsWith('data:')) {
      console.log(`Item ${itemId}: Using absolute URL: ${cleanUrl}`);
      return cleanUrl;
    }

    // Handle relative paths by prepending the backend base URL
    const baseUrl = api.defaults.baseURL ? api.defaults.baseURL.replace('/api', '') : 'http://localhost:5000/';
    // Remove leading slash to avoid double slashes
    const finalUrl = cleanUrl.startsWith('/') ? cleanUrl.slice(1) : cleanUrl;
    const resolvedUrl = `${baseUrl}${finalUrl}`;
    console.log(`Item ${itemId}: Constructed URL: ${resolvedUrl}`);
    return resolvedUrl;
  };

  // Resolve image URLs when cartItems change
  useEffect(() => {
    console.log('Cart items updated:', cartItems);
    const newImageUrls = {};
    cartItems.forEach(item => {
      const resolvedUrl = getImageUrl(item.image_url, item.id);
      newImageUrls[item.id] = resolvedUrl;
      // Save image URL in localStorage
      localStorage.setItem(`product_image_${item.id}`, resolvedUrl);
    });
    setImageUrls(newImageUrls);
  }, [cartItems]);

  if (cartItems.length === 0) {
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
        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            <img
              src={imageUrls[item.id] || '/assets/default-product.png'}
              alt={item.name}
              className="cart-item-image"
              onError={(e) => {
                if (e.target.src !== '/assets/default-product.png') {
                  console.log(`Item ${item.id}: Failed to load image ${e.target.src}, falling back to default`);
                  e.target.src = '/assets/default-product.png';
                }
              }}
            />
            <div className="cart-item-details">
              <h3>{item.name}</h3>
              <p>Price: KES {item.price}</p>
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
        ))}
        <h2 className="cart-total">Total: KES {totalPrice.toFixed(2)}</h2>
        <button className="clear-cart-button" onClick={handleClearCart}>Clear Cart</button>
        <div className="cart-actions">
          <button className="proceed-checkout-button" onClick={handleProceedToCheckout}>Proceed to Checkout</button>
          <Link to="/shop" className="continue-shopping-button">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
