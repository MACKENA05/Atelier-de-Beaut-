import React from 'react';
import './CartItem.css';

const CartItem = ({ item, onRemove }) => {
  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} className="cart-item-image" />
      <div className="cart-item-info">
        <h4>{item.name}</h4>
        <p>Quantity: {item.quantity}</p>
        <p>Price: ${(item.price * item.quantity).toFixed(2)}</p>
        <button className="remove-button" onClick={() => onRemove(item.id)}>Remove</button>
      </div>
    </div>
  );
};

export default CartItem;
