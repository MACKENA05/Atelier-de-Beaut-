import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../redux/cartSlice';
import { fetchTestimonials } from '../services/api';
import luxuryCreamImage from '../assets/images/Luxury cream.jpg';
import silkHairSerumImage from '../assets/images/silk hair serum.jpg';
import welcomeBanner from '../assets/images/welcome_homebanner.png'

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
  const [searchTerm, setSearchTerm] = useState('');
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = featuredProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <div style={styles.container}>
        <section style={styles.bannerSection}>
          <div style={styles.bannerContent}>
            <img src={welcomeBanner} alt="Welcome Banner" style={styles.bannerImage} />
            <button style={styles.ctaButton} onClick={handleShopNow}>Shop Now</button>
          </div>
    
          <div style={styles.searchContainer}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              placeholder="search featured products"
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              style={styles.searchInput}
              aria-label="Search"
            />
          </div>
        </section>
    
        <section style={styles.featuredSection}>
          <h2 style={styles.sectionTitle}>Featured Products</h2>
          <div style={styles.productsGrid}>
            {filteredProducts.map(({ id, name, image, price }) => (
              <div key={id} style={styles.productCard}>
                <img src={image} alt={name} style={styles.productImage} />
                <h3 style={styles.productName}>{name}</h3>
                <p style={styles.productPrice}>${price.toFixed(2)}</p>
                <button
                  style={styles.productButton}
                  onClick={() => handleAddToCart({ id, name, price, image })}
                >
                  Add to Cart
                </button>
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
    fontFamily: 'Poppins, sans-serif',
    backgroundColor: '#fff',
    color: '#333',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },

  bannerSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '1rem 1rem',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    marginBottom: '2rem',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)',
    maxHeight: '300px',   
  },

  bannerImage:{
    width: '100%',
    height: '200px',      
    objectFit: 'cover',
    borderRadius: '12px',
    marginBottom: '1px',
  },
  
  ctaButton: {
    backgroundColor: '#d998a3',
    color: '#000',
    border: 'none',
    padding: '0.8rem 2rem',
    fontSize: '1.1rem',
    fontWeight: '600',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
    marginTop: '1px'
  },

  searchSection: {
      flex: '1',
      display: 'flex',
      justifyContent: 'flex-start', 
      padding: '20px',
      alignitems:'left',
    },
  searchWrapper: {
      display: 'flex',
      alignItems: 'center',
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '8px 12px',
      width: '100%',
      maxWidth: '300px',
      backgroundColor: '#D9D9D9',
    },
  searchIcon: {
      marginRight: '8px',
      fontSize: '18px',
      color: '#666',
    },
  searchInput: {
      border: 'none',
      outline: 'none',
      fontSize: '16px',
      flex: 1,
      background: 'transparent',
    },
  
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#000000',
    marginBottom: '1.5rem',
    textAlign: 'center',
  },

  featuredSection: {
    marginBottom: '3rem',
  },

  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '2rem',
  },

  productCard: {
    backgroundColor: '#fff5f7',
    borderRadius: '16px',
    padding: '1rem',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  },

  productImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '12px',
    marginBottom: '1rem',
  },

  productName: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: '#333',
  },

  productPrice: {
    fontSize: '1rem',
    fontWeight: '500',
    color: '#666',
    marginBottom: '1rem',
  },

  productButton: {
    backgroundColor: '#3a0ca3',
    color: '#fff',
    border: 'none',
    padding: '0.6rem 1.2rem',
    fontSize: '0.95rem',
    borderRadius: '20px',
    cursor: 'pointer',
  },

  testimonialsSection: {
    marginTop: '4rem',
  },

  testimonialsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
  },

  testimonialCard: {
    backgroundColor: '#fef6f8',
    padding: '1.5rem',
    borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  },

  testimonialComment: {
    fontStyle: 'italic',
    color: '#3a0ca3',
    marginBottom: '1rem',
  },

  testimonialName: {
    textAlign: 'right',
    fontWeight: '600',
    color: '#333',
  },
};

export default Home