import React from 'react';

const DeliveryManagerPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Delivery Manager Dashboard</h1>
      <p>Welcome to the Delivery Manager page. Here you can manage deliveries.</p>
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

export default DeliveryManagerPage;
