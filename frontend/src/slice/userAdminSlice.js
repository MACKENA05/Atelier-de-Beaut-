import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchAdminUsers = createAsyncThunk('userAdmin/fetchAdminUsers', async () => {
  const response = await api.get('/admin/users');
  return response.data.users;
});

export const addAdminUser = createAsyncThunk('userAdmin/addAdminUser', async (user) => {
  const response = await api.post('/admin/users', user);
  return response.data.user;
});

export const updateAdminUser = createAsyncThunk('userAdmin/updateAdminUser', async (user) => {
  const response = await api.put(`/admin/users/${user.id}`, user);
  return response.data.user;
});

export const deleteAdminUser = createAsyncThunk('userAdmin/deleteAdminUser', async (id) => {
  await api.delete(`/admin/users/${id}`);
  return id;
});

const userAdminSlice = createSlice({
  name: 'userAdmin',
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addAdminUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(updateAdminUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deleteAdminUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload);
      });
  },
});

export default userAdminSlice.reducer;
