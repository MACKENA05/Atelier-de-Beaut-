import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import { fetchCart, syncMergedCart } from './cartSlice';

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      console.log('Login response:', response.data);  // Debug log
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      const guestCart = localStorage.getItem('guest_cart');
      if (guestCart) {
        // Let syncMergedCart fetch and return full updated cart
        const mergeResult = await dispatch(syncMergedCart());

        if (!syncMergedCart.fulfilled.match(mergeResult)) {
          console.warn('Cart merge failed');
        }
      } else {
        // No guest cart — safe to fetch
        await dispatch(fetchCart());
      }

      return response.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Login failed');
    }
  }
);

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue, dispatch }) => {
  try {
    const response = await api.post('/auth/register', userData);
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    // After registration, fetch authenticated user's cart and update state
    await dispatch(fetchCart());
    return response.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Registration failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    authenticated: !!localStorage.getItem('user'),
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      state.user = null;
      state.authenticated = false;
      state.error = null;
      state.loading = false;
    },
    setUser: (state, action) => {
      console.log('setUser called with:', action.payload);  // Debug log
      state.user = action.payload;
      state.authenticated = !!action.payload;
      if (action.payload) {
        localStorage.setItem('user', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('user');
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log('login.fulfilled with:', action.payload);  // Debug log
        state.user = action.payload;
        state.authenticated = true;
        state.loading = false;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.authenticated = false;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.authenticated = true;
        state.loading = false;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.authenticated = false;
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
