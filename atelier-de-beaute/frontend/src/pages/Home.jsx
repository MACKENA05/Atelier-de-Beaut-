import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../redux/cartSlice';
import { fetchTestimonials } from '../services/api';
import luxuryCreamImage from '../assets/images/Luxury cream.jpg';
import silkHairSerumImage from '../assets/images/silk hair serum.jpg';

const featuredProducts = [
  {
    id: 1,
    name: 'Luxury Face Cream',
    image: luxuryCreamImage,
    price: 49.99,
  },
  {
    id: 2,
    name: 'Silk Hair Serum',
    image: silkHairSerumImage,
    price: 29.99,
  },
  {
    id: 3,
    name: 'Organic Lip Balm',
    image: 'https://via.placeholder.com/200',
    price: 9.99,
  },
];

const Home = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const data = await fetchTestimonials();
        setTestimonials(data);
        setLoadingTestimonials(false);
      } catch (err) {
        setError('Failed to load testimonials.');
        setLoadingTestimonials(false);
      }
    };
    loadTestimonials();
  }, []);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const handleShopNow = () => {
    navigate('/shop');
  };

  return (
    <div style={styles.container}>
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Welcome to Atelier de Beauté</h1>
        <p style={styles.heroSubtitle}>
          Your one-stop shop for beauty products and more.
        </p>
        <button style={styles.ctaButton} onClick={handleShopNow}>Shop Now</button>
      </section>

      <section style={styles.featuredSection}>
        <h2 style={styles.sectionTitle}>Featured Products</h2>
        <div style={styles.productsGrid}>
          {featuredProducts.map(({ id, name, image, price }) => (
            <div key={id} style={styles.productCard}>
              <img src={image} alt={name} style={styles.productImage} />
              <h3 style={styles.productName}>{name}</h3>
              <p style={styles.productPrice}>${price.toFixed(2)}</p>
              <button style={styles.productButton} onClick={() => handleAddToCart({ id, name, price, image })}>Add to Cart</button>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.testimonialsSection}>
        <h2 style={styles.sectionTitle}>What Our Customers Say</h2>
        <div style={styles.testimonialsGrid}>
          {loadingTestimonials ? (
            <p>Loading testimonials...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            testimonials.map(({ id, name, comment }) => (
              <div key={id} style={styles.testimonialCard}>
                <p style={styles.testimonialComment}>"{comment}"</p>
                <p style={styles.testimonialName}>- {name}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#ffffff',
    color: '#3a0ca3',
    minHeight: '100vh',
    padding: '2rem',
  },
  hero: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: '#f4e1d2',
    borderRadius: '16px',
    boxShadow: '0 0 20px #f4e1d2',
    marginBottom: '3rem',
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: '700',
    marginBottom: '1rem',
    letterSpacing: '0.1rem',
    color: '#3a0ca3',
  },
  heroSubtitle: {
    fontSize: '1.5rem',
    marginBottom: '2rem',
    color: '#3a0ca3',
  },
  ctaButton: {
    padding: '1rem 2rem',
    fontSize: '1.25rem',
    borderRadius: '24px',
    border: 'none',
    backgroundColor: '#ffb703',
    color: '#3a0ca3',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 0 15px #ffb703',
    transition: 'background-color 0.3s ease',
  },
  featuredSection: {
    marginBottom: '3rem',
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '1.5rem',
    borderBottom: '2px solid #3a0ca3',
    paddingBottom: '0.5rem',
    color: '#3a0ca3',
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '2rem',
  },
  productCard: {
    backgroundColor: '#f4e1d2',
    borderRadius: '16px',
    padding: '1rem',
    boxShadow: '0 0 12px #f4e1d2',
    textAlign: 'center',
  },
  productImage: {
    width: '100%',
    borderRadius: '16px',
    marginBottom: '1rem',
  },
  productName: {
    fontSize: '1.25rem',
    marginBottom: '0.5rem',
    color: '#3a0ca3',
  },
  productPrice: {
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#3a0ca3',
  },
  productButton: {
    padding: '0.5rem 1rem',
    borderRadius: '24px',
    border: 'none',
    backgroundColor: '#ffb703',
    color: '#3a0ca3',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 0 12px #ffb703',
    transition: 'background-color 0.3s ease',
  },
  testimonialsSection: {
    marginBottom: '3rem',
  },
  testimonialsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
  },
  testimonialCard: {
    backgroundColor: '#f4e1d2',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 0 12px #f4e1d2',
  },
  testimonialComment: {
    fontStyle: 'italic',
    marginBottom: '1rem',
    color: '#3a0ca3',
  },
  testimonialName: {
    fontWeight: '700',
    textAlign: 'right',
    color: '#3a0ca3',
  },
};

export default Home;
