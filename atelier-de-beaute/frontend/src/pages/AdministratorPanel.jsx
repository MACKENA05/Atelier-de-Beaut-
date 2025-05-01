import React, { useState, useEffect } from 'react';

const AdministratorPanel = () => {
  // Sample state for dashboard stats and users
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ email: '', role: 'user' });
  const [error, setError] = useState('');

  useEffect(() => {
    // TODO: Fetch dashboard stats and users from API
    // For now, use dummy data
    setStats({
      totalUsers: 120,
      totalOrders: 350,
      totalRevenue: 12500,
    });
    setUsers([
      { id: 1, email: 'admin@example.com', role: 'administrator' },
      { id: 2, email: 'manager@example.com', role: 'product_manager' },
      { id: 3, email: 'delivery@example.com', role: 'delivery_manager' },
      { id: 4, email: 'user@example.com', role: 'user' },
    ]);
  }, []);

  const handleAddUser = () => {
    if (!newUser.email) {
      setError('Email is required');
      return;
    }
    // TODO: Add user via API
    setUsers([...users, { id: Date.now(), email: newUser.email, role: newUser.role }]);
    setNewUser({ email: '', role: 'user' });
    setError('');
  };

  const handleRemoveUser = (id) => {
    // TODO: Remove user via API
    setUsers(users.filter((user) => user.id !== id));
  };

  const handleRoleChange = (id, newRole) => {
    // TODO: Update user role via API
    setUsers(users.map((user) => (user.id === id ? { ...user, role: newRole } : user)));
  };

  return (
    <div style={styles.container}>
      <h1>Administrator Panel</h1>

      <section style={styles.section}>
        <h2>Dashboard Stats</h2>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <h3>Total Users</h3>
            <p>{stats.totalUsers}</p>
          </div>
          <div style={styles.statCard}>
            <h3>Total Orders</h3>
            <p>{stats.totalOrders}</p>
          </div>
          <div style={styles.statCard}>
            <h3>Total Revenue</h3>
            <p>${stats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      </section>

      <section style={styles.section}>
        <h2>User Management</h2>
        <div style={styles.addUserForm}>
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            style={styles.input}
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            style={styles.select}
          >
            <option value="user">User</option>
            <option value="administrator">Administrator</option>
            <option value="product_manager">Product Manager</option>
            <option value="delivery_manager">Delivery Manager</option>
          </select>
          <button onClick={handleAddUser} style={styles.button}>
            Add User
          </button>
        </div>
        {error && <p style={styles.error}>{error}</p>}

        <table style={styles.table}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(({ id, email, role }) => (
              <tr key={id}>
                <td>{email}</td>
                <td>
                  <select
                    value={role}
                    onChange={(e) => handleRoleChange(id, e.target.value)}
                    style={styles.select}
                  >
                    <option value="user">User</option>
                    <option value="administrator">Administrator</option>
                    <option value="product_manager">Product Manager</option>
                    <option value="delivery_manager">Delivery Manager</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => handleRemoveUser(id)} style={styles.removeButton}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
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
  section: {
    marginBottom: '3rem',
  },
  statsGrid: {
    display: 'flex',
    gap: '2rem',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f4e1d2',
    borderRadius: '12px',
    padding: '1rem',
    textAlign: 'center',
    boxShadow: '0 0 10px #f4e1d2',
  },
  addUserForm: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
  },
  input: {
    flex: 2,
    padding: '0.5rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
  },
  select: {
    flex: 1,
    padding: '0.5rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
  },
  button: {
    flex: 1,
    backgroundColor: '#ffb703',
    border: 'none',
    borderRadius: '8px',
    color: '#3a0ca3',
    fontWeight: '700',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  removeButton: {
    backgroundColor: '#e63946',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
  },
};

export default AdministratorPanel;
