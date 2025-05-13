import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchSalesAnalytics,
  fetchOrderAnalytics,
  fetchUserAnalytics,
  fetchTopProducts,
  fetchRevenueByCategory,
  fetchConversionRates,
  fetchAnalyticsOverview,
} from '../services/analyticsApi';

export const fetchSales = createAsyncThunk('analytics/fetchSales', async (period = 'monthly') => {
  const response = await fetchSalesAnalytics(period);
  return response.data;
});

export const fetchOrders = createAsyncThunk('analytics/fetchOrders', async (_, { rejectWithValue }) => {
  try {
    const response = await fetchOrderAnalytics();
    return response.data;
  } catch (error) {
    console.error('Error fetching order analytics:', error);
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const fetchUsers = createAsyncThunk('analytics/fetchUsers', async () => {
  const response = await fetchUserAnalytics();
  return response.data;
});

export const fetchTopProductsThunk = createAsyncThunk('analytics/fetchTopProducts', async () => {
  const response = await fetchTopProducts();
  return response.data;
});

export const fetchRevenueByCategoryThunk = createAsyncThunk('analytics/fetchRevenueByCategory', async () => {
  const response = await fetchRevenueByCategory();
  return response.data;
});

export const fetchConversionRatesThunk = createAsyncThunk('analytics/fetchConversionRates', async () => {
  const response = await fetchConversionRates();
  return response.data;
});

export const fetchOverviewThunk = createAsyncThunk('analytics/fetchOverview', async () => {
  const response = await fetchAnalyticsOverview();
  return response.data;
});

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    sales: {},
    orders: {},
    users: {},
    topProducts: [],
    revenueByCategory: [],
    conversionRates: {},
    overview: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.loading = false;
        state.sales = action.payload;
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchTopProductsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopProductsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.topProducts = action.payload;
      })
      .addCase(fetchTopProductsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchRevenueByCategoryThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRevenueByCategoryThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.revenueByCategory = action.payload;
      })
      .addCase(fetchRevenueByCategoryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchConversionRatesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversionRatesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.conversionRates = action.payload;
      })
      .addCase(fetchConversionRatesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchOverviewThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOverviewThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = action.payload;
      })
      .addCase(fetchOverviewThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default analyticsSlice.reducer;
