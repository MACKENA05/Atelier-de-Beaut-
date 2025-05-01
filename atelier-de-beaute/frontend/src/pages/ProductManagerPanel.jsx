import React from 'react';

const ProductManagerPanel = () => {
  return (
    <div style={styles.container}>
      <h1>Product Manager Panel</h1>
      <p>Welcome to the product manager panel. Here you can manage product listings and inventory.</p>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#ffffff',
    color: '#3a0ca3',
    minHeight: '100vh',
  },
};

export default ProductManagerPanel;
