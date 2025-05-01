import React from 'react';

const DeliveryManagerPanel = () => {
  return (
    <div style={styles.container}>
      <h1>Delivery Manager Panel</h1>
      <p>Welcome to the delivery manager panel. Here you can manage delivery schedules and logistics.</p>
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

export default DeliveryManagerPanel;
