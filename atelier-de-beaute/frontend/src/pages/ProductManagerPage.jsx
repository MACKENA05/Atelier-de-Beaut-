import React from 'react';

const ProductManagerPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Product Manager Dashboard</h1>
      <p>Welcome to the Product Manager page. Here you can manage products.</p>
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
    fontWeight: '700',
    fontSize: '2rem',
  },
};

export default ProductManagerPage;
