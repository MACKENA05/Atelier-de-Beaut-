import React from 'react';

const AdminDashboard = () => {
  return (
    <div style={styles.container}>
      <h1>Admin Dashboard</h1>
      <p>Welcome to the Admin Dashboard. Manage users, settings, and more here.</p>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
};

export default AdminDashboard;
