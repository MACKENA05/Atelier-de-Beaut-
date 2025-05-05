import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchAnalytics = createAsyncThunk('analytics/fetchAnalytics', async () => {
  // Simulate API call
  return {
    productAnalytics: { totalProducts: 3, topCategory: 'Skincare' },
    orderAnalytics: { totalOrders: 10, totalRevenue: 6800 },
  };
});

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    productAnalytics: {},
    orderAnalytics: {},
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAnalytics.fulfilled, (state, action) => {
      state.productAnalytics = action.payload.productAnalytics;
      state.orderAnalytics = action.payload.orderAnalytics;
    });
  },
});

export default analyticsSlice.reducer;