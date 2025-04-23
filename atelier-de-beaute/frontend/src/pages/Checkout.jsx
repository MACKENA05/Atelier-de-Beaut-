import React, { useState } from 'react';

const mockShippingMethods = [
  { id: 1, name: 'Standard Shipping', cost: 5.99, estimated: '3-5 days' },
  { id: 2, name: 'Express Shipping', cost: 12.99, estimated: '1-2 days' },
  { id: 3, name: 'Overnight Shipping', cost: 24.99, estimated: 'Next day' },
];

const Checkout = () => {
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

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Checkout</h1>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.sectionTitle}>Shipping Information</h2>
        <input
          style={styles.input}
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleInputChange}
          required
        />
        <input
          style={styles.input}
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleInputChange}
          required
        />
        <input
          style={styles.input}
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleInputChange}
          required
        />
        <input
          style={styles.input}
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          value={formData.postalCode}
          onChange={handleInputChange}
          required
        />
        <input
          style={styles.input}
          type="text"
          name="country"
          placeholder="Country"
          value={formData.country}
          onChange={handleInputChange}
          required
        />
        <h2 style={styles.sectionTitle}>Payment Information</h2>
        <input
          style={styles.input}
          type="text"
          name="cardNumber"
          placeholder="Card Number"
          value={formData.cardNumber}
          onChange={handleInputChange}
          required
        />
        <input
          style={styles.input}
          type="text"
          name="expiryDate"
          placeholder="Expiry Date (MM/YY)"
          value={formData.expiryDate}
          onChange={handleInputChange}
          required
        />
        <input
          style={styles.input}
          type="text"
          name="cvv"
          placeholder="CVV"
          value={formData.cvv}
          onChange={handleInputChange}
          required
        />
        <h2 style={styles.sectionTitle}>Shipping Method</h2>
        <select
          style={styles.select}
          value={shippingMethod.id}
          onChange={handleShippingChange}
        >
          {mockShippingMethods.map(({ id, name, cost, estimated }) => (
            <option key={id} value={id}>
              {name} - ${cost.toFixed(2)} ({estimated})
            </option>
          ))}
        </select>
        <button type="submit" style={styles.button}>
          Place Order
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#1a1a2e',
    color: '#eaeaea',
    minHeight: '100vh',
  },
  title: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    fontWeight: '700',
    fontSize: '2.5rem',
    letterSpacing: '0.1rem',
  },
  form: {
    maxWidth: '600px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    borderBottom: '2px solid #0f3460',
    paddingBottom: '0.5rem',
    marginTop: '1rem',
  },
  input: {
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    border: 'none',
    outline: 'none',
    fontSize: '1rem',
    backgroundColor: '#16213e',
    color: '#eaeaea',
    boxShadow: '0 0 8px #0f3460',
    transition: 'box-shadow 0.3s ease',
  },
  select: {
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    border: 'none',
    outline: 'none',
    fontSize: '1rem',
    backgroundColor: '#16213e',
    color: '#eaeaea',
    boxShadow: '0 0 8px #0f3460',
    transition: 'box-shadow 0.3s ease',
  },
  button: {
    marginTop: '1rem',
    padding: '0.75rem 1.5rem',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#0f3460',
    color: '#eaeaea',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 0 12px #0f3460',
    transition: 'background-color 0.3s ease',
  },
};

export default Checkout;
