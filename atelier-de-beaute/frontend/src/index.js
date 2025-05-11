import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import App from './App';
import store from './slice/store';
import { loadCartFromStorage, fetchCart, setCartItems } from './slice/cartSlice';
import api, { setLogoutHandler } from './services/api';
import { logout } from './slice/authSlice';

const Root = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // On login, merge guest cart with backend cart
      const guestCart = JSON.parse(localStorage.getItem('guest_cart')) || { items: [] };
      if (guestCart.items && guestCart.items.length > 0) {
        api.post('/cart/merge', guestCart)
          .then(() => {
            localStorage.removeItem('guest_cart');
            dispatch(fetchCart());
          })
          .catch(() => {
            dispatch(fetchCart());
          });
      } else {
        dispatch(fetchCart());
      }
      dispatch(setCartItems([])); 
    } else {
      // Load cart from local storage for guest
      dispatch(loadCartFromStorage());
    }
  }, [user, dispatch]);

  useEffect(() => {
    setLogoutHandler(() => {
      dispatch(logout());
      navigate('/login');
    });
  }, [dispatch, navigate]);

  return <App />;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Root />
      </Router>
    </Provider>
  </React.StrictMode>
);
