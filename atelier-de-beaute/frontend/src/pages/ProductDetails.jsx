import React, { useState } from 'react';

const mockProduct = {
  id: 1,
  name: 'Luxury Face Cream',
  description:
    'A luxurious face cream that hydrates and rejuvenates your skin for a radiant glow.',
  price: 49.99,
  image: 'https://via.placeholder.com/300',
  reviews: [
    { id: 1, user: 'Alice', comment: 'Amazing product!', rating: 5 },
    { id: 2, user: 'Bob', comment: 'Very moisturizing.', rating: 4 },
  ],
};

const ProductDetails = () => {
  const [product] = useState(mockProduct);
  const [quantity, setQuantity] = useState(1);

  const addToCart = () => {
    alert(`Added ${quantity} of ${product.name} to cart! (Mock)`);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{product.name}</h1>
      <div style={styles.content}>
        <img src={product.image} alt={product.name} style={styles.image} />
        <div style={styles.details}>
          <p style={styles.description}>{product.description}</p>
          <p style={styles.price}>${product.price.toFixed(2)}</p>
          <div style={styles.quantityContainer}>
            <label htmlFor="quantity" style={styles.label}>
              Quantity:
            </label>
            <input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
              style={styles.quantityInput}
            />
          </div>
          <button style={styles.button} onClick={addToCart}>
            Add to Cart
          </button>
          <div style={styles.reviews}>
            <h2 style={styles.reviewsTitle}>Reviews</h2>
            {product.reviews.map(({ id, user, comment, rating }) => (
              <div key={id} style={styles.review}>
                <strong>{user}</strong> - {rating}⭐
                <p>{comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
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
  content: {
    display: 'flex',
    gap: '2rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  image: {
    width: '300px',
    borderRadius: '12px',
    boxShadow: '0 0 12px #0f3460',
  },
  details: {
    maxWidth: '400px',
  },
  description: {
    fontSize: '1.1rem',
    marginBottom: '1rem',
  },
  price: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '1rem',
  },
  quantityContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  label: {
    fontWeight: '600',
  },
  quantityInput: {
    width: '60px',
    padding: '0.25rem',
    borderRadius: '12px',
    border: 'none',
    outline: 'none',
    fontSize: '1rem',
    backgroundColor: '#16213e',
    color: '#eaeaea',
    boxShadow: '0 0 8px #0f3460',
  },
  button: {
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
  reviews: {
    marginTop: '2rem',
  },
  reviewsTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    borderBottom: '2px solid #0f3460',
    paddingBottom: '0.5rem',
    marginBottom: '1rem',
  },
  review: {
    marginBottom: '1rem',
    backgroundColor: '#16213e',
    padding: '1rem',
    borderRadius: '12px',
    boxShadow: '0 0 8px #0f3460',
  },
};

export default ProductDetails;
