import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchInvoices = createAsyncThunk(
  'invoices/fetchInvoices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/invoices');
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
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.invoices = action.payload;
        state.loading = false;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default invoiceSlice.reducer;
