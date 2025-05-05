import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../slice/cartSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) return;
    dispatch(updateQuantity({ id, quantity }));
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return <div>Your cart is empty.</div>;
  }

  return (
    <div>
      <h1>Your Cart</h1>
      {cartItems.map(item => (
        <div key={item.id} style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
          <h3>{item.name}</h3>
          <p>Price: KES {item.price}</p>
          <p>
            Quantity: 
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
              min="1"
              style={{ width: '50px', marginLeft: '10px' }}
            />
          </p>
          <button onClick={() => handleRemove(item.id)}>Remove</button>
        </div>
      ))}
      <h2>Total: KES {totalPrice}</h2>
    </div>
  );
};

export default Cart;
