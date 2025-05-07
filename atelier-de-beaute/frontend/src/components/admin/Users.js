import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({ username: '', email: '', role: '' });
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingUser, setEditingUser] = useState({ username: '', email: '', role: '' });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleInputChange = (e, isEditing = false) => {
    const { name, value } = e.target;
    if (isEditing) {
      setEditingUser({ ...editingUser, [name]: value });
    } else {
      setNewUser({ ...newUser, [name]: value });
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/users', newUser);
      setUsers([...users, response.data]);
      setNewUser({ username: '', email: '', role: '' });
    } catch (err) {
      setError('Failed to add user');
    }
  };

  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setEditingUser({ username: user.username, email: user.email, role: user.role });
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditingUser({ username: '', email: '', role: '' });
  };

  const handleSaveEdit = async (userId) => {
    try {
      const response = await api.put(`/users/${userId}`, editingUser);
      setUsers(users.map(u => (u.id === userId ? response.data : u)));
      setEditingUserId(null);
      setEditingUser({ username: '', email: '', role: '' });
    } catch (err) {
      setError('Failed to update user');
    }
  };

  const handleDelete = async (userId) => {
    try {
      await api.delete(`/users/${userId}`);
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Manage Users</h2>
      <form onSubmit={handleAddUser}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={newUser.username}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newUser.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="role"
          placeholder="Role"
          value={newUser.role}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Add User</button>
      </form>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {editingUserId === user.id ? (
              <>
                <input
                  type="text"
                  name="username"
                  value={editingUser.username}
                  onChange={(e) => handleInputChange(e, true)}
                />
                <input
                  type="email"
                  name="email"
                  value={editingUser.email}
                  onChange={(e) => handleInputChange(e, true)}
                />
                <input
                  type="text"
                  name="role"
                  value={editingUser.role}
                  onChange={(e) => handleInputChange(e, true)}
                />
                <button onClick={() => handleSaveEdit(user.id)}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                {user.username} - {user.email} - Role: {user.role}
                <button onClick={() => handleEditClick(user)}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;