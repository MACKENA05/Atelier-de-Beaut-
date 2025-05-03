import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLanding = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Select Account to Login</h1>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => handleNavigate('/dashboard/admin')}>
          Admin Account
        </button>
        <button style={styles.button} onClick={() => handleNavigate('/dashboard/manager')}>
          Manager Account
        </button>
        <button style={styles.button} onClick={() => handleNavigate('/dashboard/sales-rep')}>
          Sales Rep Account
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    color: '#eaeaea',
  },
  title: {
    marginBottom: '2rem',
    fontSize: '2.5rem',
    fontWeight: '700',
  },
  buttonContainer: {
    display: 'flex',
    gap: '1.5rem',
  },
  button: {
    padding: '1rem 2rem',
    fontSize: '1.25rem',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#0f3460',
    color: '#eaeaea',
    fontWeight: '600',
    boxShadow: '0 0 12px #0f3460',
    transition: 'background-color 0.3s ease',
  },
};

export default AdminLanding;
