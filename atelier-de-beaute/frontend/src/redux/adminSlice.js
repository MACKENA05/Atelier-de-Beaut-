import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../services/apiClient';

const ADMIN_API_URL = '/admin';

// Create a new user
export const createUser = createAsyncThunk(
  'admin/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`${ADMIN_API_URL}/users`, userData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Create user failed');
    }
  }
);

// Get all admin data or users
export const fetchAdminData = createAsyncThunk(
  'admin/fetchAdminData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(ADMIN_API_URL);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch admin data failed');
    }
  }
);

// Get user by ID
export const fetchUserById = createAsyncThunk(
  'admin/fetchUserById',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch user failed');
    }
  }
);

// Update user by ID
export const updateUser = createAsyncThunk(
  'admin/updateUser',
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/users/${userId}`, userData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update user failed');
    }
  }
);

// Delete user by ID
export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/users/${userId}`);
      return userId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Delete user failed');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    adminData: null,
    users: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // createUser
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchAdminData
      .addCase(fetchAdminData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminData.fulfilled, (state, action) => {
        state.loading = false;
        state.adminData = action.payload;
        if (Array.isArray(action.payload.users)) {
          state.users = action.payload.users;
        }
      })
      .addCase(fetchAdminData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchUserById
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally update users array or store selected user separately
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateUser
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // deleteUser
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(user => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = adminSlice.actions;

export default adminSlice.reducer;
