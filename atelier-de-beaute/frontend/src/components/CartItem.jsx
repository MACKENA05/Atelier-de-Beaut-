import React from 'react';
import { Link } from 'react-router-dom';
import './CartItem.css';

const CartItem = ({ item, onRemove, onQuantityChange }) => {
  const increment = () => {
    onQuantityChange(item.id, item.quantity + 1);
  };

  const decrement = () => {
    if (item.quantity > 1) {
      onQuantityChange(item.id, item.quantity - 1);
    }
  };

  return (
    <div className="cart-item">
      <Link to={`/product/${item.id}`}>
        <img src={item.image} alt={item.name} className="cart-item-image" />
      </Link>
      <div className="cart-item-info">
        <Link to={`/product/${item.id}`}>
          <h4>{item.name}</h4>
        </Link>
        <div className="quantity-controls">
          <button onClick={decrement} className="quantity-button">-</button>
          <span className="quantity-value">{item.quantity}</span>
          <button onClick={increment} className="quantity-button">+</button>
        </div>
        <p>Price: ${(item.price * item.quantity).toFixed(2)}</p>
        <button className="remove-button" onClick={() => onRemove(item.id)}>Remove</button>
      </div>
    </div>
  );
};

export default CartItem;
