import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import { fetchCart, syncMergedCart } from './cartSlice';


export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue, dispatch }) => {
  try {
    const response = await api.post('/auth/login', credentials);
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    // Merge guest cart after login
    const guestCart = localStorage.getItem('guest_cart');
    if (guestCart) {
      try {
        console.log('Merging guest cart:', guestCart);
        // Transform guestCart array to object with 'items' key and product_id field
        const guestCartItems = JSON.parse(guestCart).map(item => ({
          product_id: item.id,
          quantity: item.quantity
        }));
        await api.post('/cart/merge', { items: guestCartItems });
        console.log('Guest cart merged successfully');

        // Sync merged cart to update frontend state
        await dispatch(syncMergedCart());

        // Clear guest cart from localStorage after successful merge and sync
        localStorage.removeItem('guest_cart');
      } catch (mergeError) {
        console.error('Failed to merge guest cart:', mergeError);
      }
    } else {
      // No guest cart to merge, just fetch cart
      await dispatch(fetchCart());
    }

    console.log('Fetched authenticated user cart');
    return response.data.user;
  } catch (err) {
    console.error('Login failed:', err);
    return rejectWithValue(err.response?.data?.error || 'Login failed');
  }
});

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