import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import './UsersTable.css';

const toSnakeCase = (obj) => {
  const map = {
    firstName: 'first_name',
    lastName: 'last_name',
    isActive: 'is_active',
  };
  const newObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = map[key] || key;
      newObj[newKey] = obj[key];
    }
  }
  return newObj;
};

const toCamelCase = (obj) => {
  const map = {
    first_name: 'firstName',
    last_name: 'lastName',
    is_active: 'isActive',
  };
  const newObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = map[key] || key;
      newObj[newKey] = obj[key];
    }
  }
  return newObj;
};

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
    firstName: '',
    lastName: '',
    phone: '',
    isActive: true,
  });
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingUser, setEditingUser] = useState({
    username: '',
    email: '',
    role: '',
    firstName: '',
    lastName: '',
    phone: '',
    isActive: true,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/admin/users');
        if (response.status === 200) {
          const usersCamelCase = response.data.users.map(user => toCamelCase(user));
          setUsers(usersCamelCase);
          setError(null);
        } else {
          setError(`Failed to fetch users: ${response.statusText || response.status}`);
        }
      } catch (err) {
        setError(`Failed to fetch users: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleInputChange = (e, isEditing = false) => {
    const { name, value, type, checked } = e.target;
    if (isEditing) {
      setEditingUser({ ...editingUser, [name]: type === 'checkbox' ? checked : value });
    } else {
      setNewUser({ ...newUser, [name]: type === 'checkbox' ? checked : value });
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const payload = toSnakeCase(newUser);
      const response = await api.post('/admin/users', payload);
      if (response.status === 201) {
        const userCamelCase = toCamelCase(response.data.user);
        setUsers([...users, userCamelCase]);
        setNewUser({
          username: '',
          email: '',
          password: '',
          role: '',
          firstName: '',
          lastName: '',
          phone: '',
          isActive: true,
        });
        setShowAddForm(false);
        setError(null);
      } else {
        setError(`Failed to add user: ${response.statusText || response.status}`);
      }
    } catch (err) {
      setError(`Failed to add user: ${err.message}`);
    }
  };

  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setEditingUser(user);
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditingUser({
      username: '',
      email: '',
      role: '',
      firstName: '',
      lastName: '',
      phone: '',
      isActive: true,
    });
  };

  const handleSaveEdit = async (userId) => {
    try {
      // Remove unknown fields that cause validation errors
      const cleanedUser = { ...editingUser };
      delete cleanedUser.createdAt;
      delete cleanedUser.id;
      delete cleanedUser.lastLogin;

      // Clean phone number to contain only digits
      if (cleanedUser.phone) {
        cleanedUser.phone = cleanedUser.phone.replace(/\D/g, '');
      }

      // Remove created_at and last_login keys if present in snake_case form
      const payload = toSnakeCase(cleanedUser);
      delete payload.created_at;
      delete payload.last_login;

      if (payload.password) {
        delete payload.password;
      }
      const response = await api.put(`/admin/users/${userId}`, payload);
      if (response.status === 200) {
        const userCamelCase = toCamelCase(response.data.user);
        setUsers(users.map(u => (u.id === userId ? userCamelCase : u)));
        setEditingUserId(null);
        setEditingUser({
          username: '',
          email: '',
          role: '',
          firstName: '',
          lastName: '',
          phone: '',
          isActive: true,
        });
        setError(null);
      } else {
        setError(`Failed to update user: ${response.statusText || response.status}`);
      }
    } catch (err) {
      setError(`Failed to update user: ${err.message}`);
    }
  };

  const handleDelete = async (userId) => {
    try {
      // Send empty JSON body with DELETE request to satisfy backend expecting JSON content
      const response = await api.delete(`/admin/users/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        data: {},
      });
      if (response.status === 200) {
        setUsers(users.filter(u => u.id !== userId));
        setError(null);
      } else {
        setError(`Failed to delete user: ${response.statusText || response.status}`);
      }
    } catch (err) {
      setError(`Failed to delete user: ${err.message}`);
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="users-table-container">
      <h2>Manage Users</h2>
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="add-user-btn"
      >
        <FaPlus /> {showAddForm ? 'Cancel' : 'Add User'}
      </button>
      {showAddForm && (
        <form onSubmit={handleAddUser} className="add-user-form">
          {['username', 'email', 'password', 'role', 'firstName', 'lastName', 'phone'].map(field => (
            <input
              key={field}
              type={field === 'email' ? 'email' : field === 'password' ? 'password' : 'text'}
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={newUser[field]}
              onChange={handleInputChange}
              required={field !== 'phone'}
            />
          ))}
          <label>
            Is Active
            <input
              type="checkbox"
              name="isActive"
              checked={newUser.isActive}
              onChange={handleInputChange}
            />
          </label>
          <button type="submit" className="submit-btn">Add User</button>
        </form>
      )}
      <table className="users-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Phone</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              {editingUserId === user.id ? (
                <>
                  <td>
                    <input
                      type="text"
                      name="username"
                      value={editingUser.username}
                      onChange={(e) => handleInputChange(e, true)}
                    />
                  </td>
                  <td>
                    <input
                      type="email"
                      name="email"
                      value={editingUser.email}
                      onChange={(e) => handleInputChange(e, true)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="role"
                      value={editingUser.role}
                      onChange={(e) => handleInputChange(e, true)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="firstName"
                      value={editingUser.firstName}
                      onChange={(e) => handleInputChange(e, true)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="lastName"
                      value={editingUser.lastName}
                      onChange={(e) => handleInputChange(e, true)}
                    />
                  </td>
                  <td>
                    <input
                      type="tel"
                      name="phone"
                      value={editingUser.phone}
                      onChange={(e) => handleInputChange(e, true)}
                    />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={editingUser.isActive}
                      onChange={(e) => handleInputChange(e, true)}
                    />
                  </td>
                  <td className="actions">
                    <button onClick={() => handleSaveEdit(user.id)} title="Save" aria-label="Save user changes">
                      <FaEdit />
                    </button>
                    <button onClick={handleCancelEdit} title="Cancel" aria-label="Cancel editing user">
                      &#x2716;
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.phone}</td>
                  <td style={{ textAlign: 'center' }}>{user.isActive ? 'Yes' : 'No'}</td>
                  <td className="actions">
                    <button onClick={() => handleEditClick(user)} title="Edit User" aria-label="Edit user">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(user.id)} title="Delete User" aria-label="Delete user">
                      <FaTrash />
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
