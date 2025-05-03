import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchAdminData,
  createUser,
  updateUser,
  deleteUser,
  clearError,
} from '../redux/adminSlice';

const AdministratorPanel = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.admin);

  const [formData, setFormData] = useState({
    id: null,
    name: '',
    email: '',
    role: 'user',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminData());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      dispatch(updateUser({ userId: formData.id, userData: formData })).then(() => {
        setIsEditing(false);
        setFormData({ id: null, name: '', email: '', role: 'user' });
        dispatch(fetchAdminData());
      });
    } else {
      dispatch(createUser(formData)).then(() => {
        setFormData({ id: null, name: '', email: '', role: 'user' });
        dispatch(fetchAdminData());
      });
    }
  };

  const handleEdit = (user) => {
    setIsEditing(true);
    setFormData({
      id: user.id,
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'user',
    });
  };

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(userId)).then(() => {
        dispatch(fetchAdminData());
      });
    }
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return (
    <div style={styles.container}>
      <h1>Administrator Panel</h1>

      {error && (
        <div style={styles.error}>
          <p>{error}</p>
          <button onClick={handleClearError} style={styles.clearErrorButton}>Clear</button>
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>{isEditing ? 'Edit User' : 'Create User'}</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
          required
          style={styles.input}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
          style={styles.input}
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleInputChange}
          style={styles.select}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Saving...' : isEditing ? 'Update User' : 'Create User'}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setFormData({ id: null, name: '', email: '', role: 'user' });
            }}
            style={styles.cancelButton}
          >
            Cancel
          </button>
        )}
      </form>

      <h2>User List</h2>
      {loading && <p>Loading users...</p>}
      {!loading && users.length === 0 && <p>No users found.</p>}
      {!loading && users.length > 0 && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={styles.tr}>
                <td style={styles.td}>{user.id}</td>
                <td style={styles.td}>{user.name}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>{user.role}</td>
                <td style={styles.td}>
                  <button onClick={() => handleEdit(user)} style={styles.actionButton}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(user.id)} style={styles.deleteButton}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#333',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '1rem',
    marginBottom: '1rem',
    borderRadius: '4px',
  },
  clearErrorButton: {
    marginTop: '0.5rem',
    padding: '0.25rem 0.5rem',
    backgroundColor: '#721c24',
    color: '#fff',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
  },
  form: {
    marginBottom: '2rem',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '400px',
    gap: '0.75rem',
  },
  input: {
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  select: {
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#0f3460',
    color: '#fff',
    cursor: 'pointer',
  },
  cancelButton: {
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#888',
    color: '#fff',
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    borderBottom: '2px solid #ddd',
    padding: '0.5rem',
    textAlign: 'left',
  },
  tr: {
    borderBottom: '1px solid #ddd',
  },
  td: {
    padding: '0.5rem',
  },
  actionButton: {
    marginRight: '0.5rem',
    padding: '0.25rem 0.5rem',
    backgroundColor: '#0f3460',
    color: '#fff',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '0.25rem 0.5rem',
    backgroundColor: '#c82333',
    color: '#fff',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
  },
};

export default AdministratorPanel;
