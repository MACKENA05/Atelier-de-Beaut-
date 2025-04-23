import React, { useState } from 'react';
import './Cart.css';

const mockCartItems = [
  {
    id: 1,
    name: 'Luxury Face Cream',
    price: 49.99,
    quantity: 2,
    image: 'https://via.placeholder.com/100',
  },
  {
    id: 2,
    name: 'Silk Hair Serum',
    price: 29.99,
    quantity: 1,
    image: 'https://via.placeholder.com/100',
  },
];

const Cart = () => {
  const [cartItems, setCartItems] = useState(mockCartItems);

  const updateQuantity = (id, quantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="container">
      <h1 className="title">Your Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p className="emptyMessage">Your cart is empty.</p>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th className="th">Product</th>
                <th className="th">Price</th>
                <th className="th">Quantity</th>
                <th className="th">Total</th>
                <th className="th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(({ id, name, price, quantity, image }) => (
                <tr key={id} className="tr">
                  <td className="tdProduct">
                    <img src={image} alt={name} className="image" />
                    <span>{name}</span>
                  </td>
                  <td className="td">${price.toFixed(2)}</td>
                  <td className="td">
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => updateQuantity(id, parseInt(e.target.value))}
                      className="quantityInput"
                    />
                  </td>
                  <td className="td">${(price * quantity).toFixed(2)}</td>
                  <td className="td">
                    <button className="removeButton" onClick={() => removeItem(id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="totalContainer">
            <strong>Total: ${totalPrice.toFixed(2)}</strong>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
