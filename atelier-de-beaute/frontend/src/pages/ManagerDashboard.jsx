import React from 'react';

const ManagerDashboard = () => {
  return (
    <div style={styles.container}>
      <h1>Manager Dashboard</h1>
      <p>Welcome to the Manager Dashboard. Manage your team and tasks here.</p>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
};

export default ManagerDashboard;
