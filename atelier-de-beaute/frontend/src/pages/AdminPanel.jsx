import React, { useState } from 'react';
import ProductManagerPage from './ProductManagerPage';
import DeliveryManagerPage from './DeliveryManagerPage';

const mockUsers = [
  { id: 1, name: 'Alice Johnson', role: 'Admin', email: 'alice@example.com' },
  { id: 2, name: 'Bob Smith', role: 'Editor', email: 'bob@example.com' },
  { id: 3, name: 'Charlie Brown', role: 'Viewer', email: 'charlie@example.com' },
];

const AdminPanel = () => {
  const [users, setUsers] = useState(mockUsers);
  const [newUser, setNewUser] = useState({ name: '', role: '', email: '' });
  const [activeTab, setActiveTab] = useState('administrator');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const addUser = () => {
    if (newUser.name && newUser.role && newUser.email) {
      setUsers((prev) => [
        ...prev,
        { id: prev.length + 1, ...newUser },
      ]);
      setNewUser({ name: '', role: '', email: '' });
    }
  };

  const renderAdministratorPanel = () => (
    <div>
      <h2>User Management</h2>
      <div style={styles.form}>
        <input
          style={styles.input}
          type="text"
          name="name"
          placeholder="Name"
          value={newUser.name}
          onChange={handleInputChange}
        />
        <input
          style={styles.input}
          type="text"
          name="role"
          placeholder="Role"
          value={newUser.role}
          onChange={handleInputChange}
        />
        <input
          style={styles.input}
          type="email"
          name="email"
          placeholder="Email"
          value={newUser.email}
          onChange={handleInputChange}
        />
        <button style={styles.button} onClick={addUser}>Add User</button>
      </div>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Role</th>
            <th style={styles.th}>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map(({ id, name, role, email }) => (
            <tr key={id} style={styles.tr}>
              <td style={styles.td}>{id}</td>
              <td style={styles.td}>{name}</td>
              <td style={styles.td}>{role}</td>
              <td style={styles.td}>{email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderStoreManagerPanel = () => (
    <div>
      <h2>Store Manager Panel</h2>
      <ProductManagerPage />
    </div>
  );

  const renderStoreAgentPanel = () => (
    <div>
      <h2>Store Agent Panel</h2>
      <DeliveryManagerPage />
    </div>
  );

  const renderAnalyticsPanel = () => (
    <div style={styles.analyticsContainer}>
      <h2>Analytics Dashboard</h2>
      <div style={styles.analyticsGrid}>
        <div style={styles.analyticsCard}>
          <h3>Total Sales</h3>
          <p>$123,456</p>
        </div>
        <div style={styles.analyticsCard}>
          <h3>Active Users</h3>
          <p>1,234</p>
        </div>
        <div style={styles.analyticsCard}>
          <h3>Site Traffic</h3>
          <p>12,345 visits</p>
        </div>
      </div>
    </div>
  );

  const renderActivePanel = () => {
    switch (activeTab) {
      case 'administrator':
        return renderAdministratorPanel();
      case 'storeManager':
        return renderStoreManagerPanel();
      case 'storeAgent':
        return renderStoreAgentPanel();
      case 'analytics':
        return renderAnalyticsPanel();
      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Admin Panel</h1>
      <div style={styles.tabContainer}>
        <button
          style={activeTab === 'administrator' ? styles.activeTabButton : styles.tabButton}
          onClick={() => setActiveTab('administrator')}
        >
          Administrator
        </button>
        <button
          style={activeTab === 'storeManager' ? styles.activeTabButton : styles.tabButton}
          onClick={() => setActiveTab('storeManager')}
        >
          Store Manager
        </button>
        <button
          style={activeTab === 'storeAgent' ? styles.activeTabButton : styles.tabButton}
          onClick={() => setActiveTab('storeAgent')}
        >
          Store Agent
        </button>
        <button
          style={activeTab === 'analytics' ? styles.activeTabButton : styles.tabButton}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>
      <div style={styles.panelContent}>
        {renderActivePanel()}
      </div>
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
    textAlign: 'center',
    marginBottom: '1.5rem',
    fontWeight: '700',
    fontSize: '2.5rem',
    letterSpacing: '0.1rem',
  },
  tabContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '2rem',
  },
  tabButton: {
    padding: '0.75rem 1.5rem',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#0f3460',
    color: '#eaeaea',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 0 8px #0f3460',
    transition: 'background-color 0.3s ease',
  },
  activeTabButton: {
    padding: '0.75rem 1.5rem',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#ffb703',
    color: '#1a1a2e',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 0 12px #ffb703',
    transition: 'background-color 0.3s ease',
  },
  panelContent: {
    backgroundColor: '#16213e',
    padding: '1rem',
    borderRadius: '12px',
    boxShadow: '0 0 12px #0f3460',
  },
  form: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '2rem',
  },
  input: {
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    border: 'none',
    outline: 'none',
    fontSize: '1rem',
    width: '200px',
    backgroundColor: '#16213e',
    color: '#eaeaea',
    boxShadow: '0 0 8px #0f3460',
    transition: 'box-shadow 0.3s ease',
  },
  button: {
    padding: '0.75rem 1.5rem',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#0f3460',
    color: '#eaeaea',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 0 12px #0f3460',
    transition: 'background-color 0.3s ease',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    borderBottom: '2px solid #0f3460',
    padding: '0.75rem',
    textAlign: 'left',
    fontWeight: '600',
  },
  tr: {
    borderBottom: '1px solid #0f3460',
  },
  td: {
    padding: '0.75rem',
  },
  analyticsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  analyticsGrid: {
    display: 'flex',
    gap: '1rem',
  },
  analyticsCard: {
    flex: 1,
    backgroundColor: '#0f3460',
    padding: '1rem',
    borderRadius: '12px',
    boxShadow: '0 0 8px #0f3460',
    textAlign: 'center',
  },
};

export default AdminPanel;
