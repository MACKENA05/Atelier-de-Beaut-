import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = sessionStorage.getItem('userRole');
    if (role === 'administrator') {
      navigate('/admin');
    } else if (role === 'product_manager') {
      navigate('/product-manager');
    } else if (role === 'delivery_manager') {
      navigate('/delivery-manager');
    } else {
      // If no role or unknown role, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Redirecting...</h1>
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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: '700',
    fontSize: '2rem',
  },
};

export default LandingPage;
