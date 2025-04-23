import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [
    {
      id: 1,
      name: 'Luxury Face Cream',
      price: 49.99,
      quantity: 2,
      image: 'https://via.placeholder.com/100',
    },
    {
      id: 2,
      name: 'Silk Hair Serum',
      price: 29.99,
      quantity: 1,
      image: 'https://via.placeholder.com/100',
    },
  ],
  discount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    removeFromCart(state, action) {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateQuantity(state, action) {
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
});

export const { removeFromCart, updateQuantity, clearCart, applyDiscount } = cartSlice.actions;

export default cartSlice.reducer;
