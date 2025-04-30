import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCart, addCartItem, updateCartItem, removeCartItem } from '../services/api';

// Async thunks for backend cart sync
export const fetchCartFromBackend = createAsyncThunk(
  'cart/fetchCartFromBackend',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchCart();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addCartItemToBackend = createAsyncThunk(
  'cart/addCartItemToBackend',
  async (product, { rejectWithValue }) => {
    try {
      const data = await addCartItem(product);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCartItemInBackend = createAsyncThunk(
  'cart/updateCartItemInBackend',
  async ({ id, quantity }, { rejectWithValue }) => {
    try {
      const data = await updateCartItem(id, quantity);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeCartItemFromBackend = createAsyncThunk(
  'cart/removeCartItemFromBackend',
  async (id, { rejectWithValue }) => {
    try {
      const data = await removeCartItem(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  discount: 0,
  loading: false,
  error: null,
};

// Local reducers for cart state management
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCartLocal(state, action) {
      const product = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
    },
    removeFromCartLocal(state, action) {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateQuantityLocal(state, action) {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
    },
    clearCart(state) {
      state.items = [];
      state.discount = 0;
    },
    applyDiscount(state, action) {
      state.discount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartFromBackend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartFromBackend.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
      })
      .addCase(fetchCartFromBackend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addCartItemToBackend.fulfilled, (state, action) => {
        state.items = action.payload.items || state.items;
      })
      .addCase(updateCartItemInBackend.fulfilled, (state, action) => {
        state.items = action.payload.items || state.items;
      })
      .addCase(removeCartItemFromBackend.fulfilled, (state, action) => {
        state.items = action.payload.items || state.items;
      });
  },
});

// Wrapper async thunks that check login state and decide to use backend or local reducers
export const fetchCartThunk = createAsyncThunk(
  'cart/fetchCartThunk',
  async (_, { dispatch, getState }) => {
    const { auth } = getState();
    if (auth.user) {
      return dispatch(fetchCartFromBackend()).unwrap();
    } else {
      return Promise.resolve();
    }
  }
);

export const addToCartThunk = createAsyncThunk(
  'cart/addToCartThunk',
  async (product, { dispatch, getState }) => {
    const { auth } = getState();
    if (auth.user) {
      return dispatch(addCartItemToBackend(product)).unwrap();
    } else {
      dispatch(cartSlice.actions.addToCartLocal(product));
      return Promise.resolve();
    }
  }
);

export const updateQuantityThunk = createAsyncThunk(
  'cart/updateQuantityThunk',
  async ({ id, quantity }, { dispatch, getState }) => {
    const { auth } = getState();
    if (auth.user) {
      return dispatch(updateCartItemInBackend({ id, quantity })).unwrap();
    } else {
      dispatch(cartSlice.actions.updateQuantityLocal({ id, quantity }));
      return Promise.resolve();
    }
  }
);

export const removeFromCartThunk = createAsyncThunk(
  'cart/removeFromCartThunk',
  async (id, { dispatch, getState }) => {
    const { auth } = getState();
    if (auth.user) {
      return dispatch(removeCartItemFromBackend(id)).unwrap();
    } else {
      dispatch(cartSlice.actions.removeFromCartLocal(id));
      return Promise.resolve();
    }
  }
);

export const {
  addToCartLocal,
  removeFromCartLocal,
  updateQuantityLocal,
  clearCart,
  applyDiscount,
} = cartSlice.actions;

export const addToCart = addToCartLocal;
export const removeFromCart = removeFromCartLocal;
export const updateQuantity = updateQuantityLocal;

export default cartSlice.reducer;
