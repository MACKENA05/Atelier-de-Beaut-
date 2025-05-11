import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchInvoices = createAsyncThunk(
  'invoices/fetchInvoices',
  async ({ status, page = 1, perPage = 10 }, { rejectWithValue }) => {
    try {
      const params = {};
      if (status) params.status = status;
      if (page) params.page = page;
      if (perPage) params.per_page = perPage;
      const response = await api.get('/orders/invoices', { params });
      return response.data;
    } catch (err) {
      if (!err.response) {
        return rejectWithValue('Failed to fetch invoices: Network error or server is down');
      }
      const { status, data } = err.response;
      if (status === 500) {
        return rejectWithValue('Failed to fetch invoices: Server error');
      }
      return rejectWithValue(data?.error || `Failed to fetch invoices: ${err.message}`);
    }
  }
);

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState: {
    invoices: [],
    loading: false,
    error: null,
    total: 0,
    pages: 0,
    currentPage: 1,
    perPage: 10,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.invoices = action.payload.invoices;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
        state.currentPage = action.payload.current_page;
        state.perPage = action.payload.per_page;
        state.loading = false;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default invoiceSlice.reducer;
