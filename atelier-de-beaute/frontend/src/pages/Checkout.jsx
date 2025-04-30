import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import './Checkout.css';

const mockShippingMethods = [
  { id: 1, name: 'Standard Shipping', cost: 5.99, estimated: '3-5 days' },
  { id: 2, name: 'Express Shipping', cost: 12.99, estimated: '1-2 days' },
  { id: 3, name: 'Overnight Shipping', cost: 24.99, estimated: 'Next day' },
];

const Checkout = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const discount = useSelector((state) => state.cart.discount);

  const [shippingMethod, setShippingMethod] = useState(mockShippingMethods[0]);
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleShippingChange = (e) => {
    const selected = mockShippingMethods.find(
      (method) => method.id === parseInt(e.target.value)
    );
    setShippingMethod(selected);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Order placed successfully! (Mock)');
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.07;
  const shippingCost = shippingMethod.cost;
  const discountAmount = subtotal * discount;
  const total = subtotal + tax + shippingCost - discountAmount;

  return (
    <div className="container">
      <h1 className="title">Checkout</h1>
      {cartItems.length === 0 ? (
        <p className="emptyMessage">Your cart is empty.</p>
      ) : (
        <>
          <div className="orderSummary">
            <h2 className="sectionTitle">Order Summary</h2>
            <ul className="itemList">
              {cartItems.map((item) => (
                <li key={item.id} className="item">
                  {item.name} x {item.quantity} - ${ (item.price * item.quantity).toFixed(2) }
                </li>
              ))}
            </ul>
            <p>Subtotal: ${subtotal.toFixed(2)}</p>
            <p>Tax (7%): ${tax.toFixed(2)}</p>
            <p>Shipping: ${shippingCost.toFixed(2)}</p>
            {discount > 0 && <p>Discount: -${discountAmount.toFixed(2)}</p>}
            <strong>Total: ${total.toFixed(2)}</strong>
          </div>
          <form className="form" onSubmit={handleSubmit}>
            <h2 className="sectionTitle">Shipping Information</h2>
            <input
              className="input"
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
            <input
              className="input"
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
            <input
              className="input"
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleInputChange}
              required
            />
            <input
              className="input"
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              value={formData.postalCode}
              onChange={handleInputChange}
              required
            />
            <input
              className="input"
              type="text"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleInputChange}
              required
            />
            <h2 className="sectionTitle">Payment Information</h2>
            <input
              className="input"
              type="text"
              name="cardNumber"
              placeholder="Card Number"
              value={formData.cardNumber}
              onChange={handleInputChange}
              required
            />
            <input
              className="input"
              type="text"
              name="expiryDate"
              placeholder="Expiry Date (MM/YY)"
              value={formData.expiryDate}
              onChange={handleInputChange}
              required
            />
            <input
              className="input"
              type="text"
              name="cvv"
              placeholder="CVV"
              value={formData.cvv}
              onChange={handleInputChange}
              required
            />
            <h2 className="sectionTitle">Shipping Method</h2>
            <select
              className="select"
              value={shippingMethod.id}
              onChange={handleShippingChange}
            >
              {mockShippingMethods.map(({ id, name, cost, estimated }) => (
                <option key={id} value={id}>
                  {name} - ${cost.toFixed(2)} ({estimated})
                </option>
              ))}
            </select>
            <button type="submit" className="button">
              Place Order
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Checkout;
