
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import axios from 'axios';

const LOCAL_STORAGE_CART_KEY = 'guest_cart';

const initialState = {
  items: [],
  loading: false,
  error: null,
  authenticated: false,
};

// Async thunk to fetch cart for authenticated user
// Async thunk to fetch cart for authenticated user
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const userId = state.auth.user?.id;
    if (!userId) return rejectWithValue('User not authenticated');
    try {
      const response = await api.get('/cart');
      console.log('fetchCart response:', response.data);
      return response.data.items;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Async thunk to fetch cart for authenticated user
export const syncMergedCart = createAsyncThunk(
  'cart/syncMergedCart',
  async (_, { rejectWithValue }) => {
    const guestCartItems = JSON.parse(localStorage.getItem('guest_cart')) || [];
    console.log('syncMergedCart guestCartItems:', guestCartItems);
    if (guestCartItems.length === 0) {
      return [];
    }

    try {
      const response = await axios.post('http://localhost:5000/api/cart/merge', {
        items: guestCartItems
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      console.log('syncMergedCart response:', response.data);

      localStorage.removeItem('guest_cart');

      return response.data.items;
    } catch (err) {
      console.error('syncMergedCart error:', err);
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);



// Async thunk to add item to backend cart
export const addToCartBackend = createAsyncThunk(
  'cart/addToCartBackend',
  async (product, { getState, rejectWithValue }) => {
    console.log("cart details",product);
    const state = getState();
    const userId = state.auth.user?.id;
    if (!userId) return rejectWithValue('User not authenticated');

    try {
      const response = await api.post('/cart/add', { product_id: product.product_id || product.id, quantity: product.quantity });
      console.log("add cart response ", response);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Async thunk to update item quantity in backend cart
export const updateCartBackend = createAsyncThunk(
  'cart/updateCartBackend',
  async ({ id, quantity }, { getState, rejectWithValue }) => {
    const state = getState();
    const userId = state.auth.user?.id;
    if (!userId) return rejectWithValue('User not authenticated');
    try {
      const response = await api.put('/cart/update', { product_id: id, quantity });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Async thunk to remove item from backend cart
export const removeFromCartBackend = createAsyncThunk(
  'cart/removeFromCartBackend',
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const userId = state.auth.user?.id;
    if (!userId) return rejectWithValue('User not authenticated');
    try {
      await api.delete(`/cart/remove/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Async thunk to clear the backend cart
export const clearCartBackend = createAsyncThunk(
  'cart/clearCartBackend',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const userId = state.auth.user?.id;
    if (!userId) return rejectWithValue('User not authenticated');
    try {
      await api.delete('/cart');
      return;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Helper to load guest cart from local storage
const loadGuestCart = () => {
  try {
    const serializedCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
    if (serializedCart === null) {
      return [];
    }
    return JSON.parse(serializedCart);
  } catch (e) {
    return [];
  }
};

// Helper to save guest cart to local storage
const saveGuestCart = (items) => {
  try {
    const serializedCart = JSON.stringify(items);
    localStorage.setItem(LOCAL_STORAGE_CART_KEY, serializedCart);
  } catch (e) {
    // ignore write errors
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.id === product.id);
      if (existingItemIndex !== -1) {
        // Create a new array with updated quantity to ensure immutability
        state.items = state.items.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        state.items = [...state.items, { ...product, quantity: 1 }];
      }
      if (!state.authenticated) {
        saveGuestCart(state.items);
      }
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(item => item.id !== id);
      if (!state.authenticated) {
        saveGuestCart(state.items);
      }
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.id !== id);
        } else {
          item.quantity = quantity;
        }
      }
      if (!state.authenticated) {
        saveGuestCart(state.items);
      }
    },
    clearCart: (state) => {
      state.items = [];
      if (!state.authenticated) {
        saveGuestCart(state.items);
      }
    },
    setAuthenticated: (state, action) => {
      state.authenticated = action.payload;
      if (!state.authenticated) {
        state.items = loadGuestCart();
      }
    },
    setCartItems: (state, action) => {
      state.items = action.payload;
    },
    loadCartFromStorage: (state) => {
      if (!state.authenticated) {
        state.items = loadGuestCart();
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        console.log('fetchCart fulfilled payload:', action.payload);
        const guestCartItems = loadGuestCart();
        console.log('fetchCart fulfilled guestCartItems:', guestCartItems);

        // Merge guest cart items with fetched cart items, summing quantities for duplicates
        const mergedItemsMap = new Map();

        // Add fetched cart items first
        action.payload.forEach(item => {
          mergedItemsMap.set(item.id, { ...item });
        });

        // Merge guest cart items
        guestCartItems.forEach(guestItem => {
          if (mergedItemsMap.has(guestItem.id)) {
            mergedItemsMap.get(guestItem.id).quantity += guestItem.quantity;
          } else {
            mergedItemsMap.set(guestItem.id, { ...guestItem });
          }
        });

        state.items = Array.from(mergedItemsMap.values());
        state.loading = false;
        state.authenticated = true;

        // Clear guest cart from localStorage after merging
        localStorage.removeItem(LOCAL_STORAGE_CART_KEY);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.authenticated = false;
        state.items = loadGuestCart();
      })
      .addCase(addToCartBackend.fulfilled, (state, action) => {
        let product = action.payload;
        // Map product_id to id for frontend consistency
        if (product.product_id && !product.id) {
          product = { ...product, id: product.product_id };
        }
        const existingItem = state.items.find(item => item.id === product.id);
        if (existingItem) {
          existingItem.quantity = product.quantity;
        } else {
          state.items.push(product);
        }
      })
      .addCase(updateCartBackend.fulfilled, (state, action) => {
        const updatedItem = action.payload;
        const index = state.items.findIndex(item => item.id === updatedItem.id);
        if (index !== -1) {
          state.items[index] = updatedItem;
        }
      })
      .addCase(removeFromCartBackend.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(clearCartBackend.fulfilled, (state) => {
        state.items = [];
      })
      .addCase(syncMergedCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.authenticated = true;
      })
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setAuthenticated, setCartItems, loadCartFromStorage } = cartSlice.actions;
export default cartSlice.reducer;
