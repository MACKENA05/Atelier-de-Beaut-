import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// Create order
export const createOrder = createAsyncThunk(
  'payment/createOrder',
  async ({ address, payment_method, shipping_method, total }, { rejectWithValue }) => {
    try {
      console.log('Creating order with payload:', { address, payment_method, shipping_method, total });
      const response = await api.post('/api/orders', {
        address,
        payment_method,
        shipping_method,
        total,
      });
      console.log('Create order response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Order creation error:', error.message, error.response?.data);
      const errorData = error.response?.data || {
        error: error.message.includes('ERR_CONNECTION_REFUSED')
          ? 'Cannot connect to backend. Ensure Flask server is running on localhost:5000.'
          : 'Failed to create order',
        status: error.response?.status,
      };
      return rejectWithValue(errorData);
    }
  }
);

// Initiate M-Pesa payment
export const initiatePayment = createAsyncThunk(
  'payment/initiatePayment',
  async ({ orderId, phoneNumber }, { rejectWithValue }) => {
    try {
      console.log('Initiating payment:', { orderId, phoneNumber });
      const response = await api.post(`/api/payment/checkout/${orderId}`, {
        phone_number: phoneNumber,
      });
      console.log('Initiate payment response:', response.data);
      if (!response.data.data?.CheckoutRequestID) {
        throw new Error('No CheckoutRequestID returned from sandbox');
      }
      return response.data;
    } catch (error) {
      console.error('Initiate payment error:', error.message, error.response?.data);
      return rejectWithValue(error.response?.data || { error: 'Payment initiation failed' });
    }
  }
);

// Retry payment
export const retryPayment = createAsyncThunk(
  'payment/retryPayment',
  async ({ orderId, phoneNumber }, { rejectWithValue }) => {
    try {
      console.log('Retrying payment:', { orderId, phoneNumber });
      const response = await api.post(`/api/payment/mpesa/retry/${orderId}`, {
        phone_number: phoneNumber,
      });
      console.log('Retry payment response:', response.data);
      if (!response.data.data?.CheckoutRequestID) {
        throw new Error('No CheckoutRequestID returned from sandbox retry');
      }
      return response.data;
    } catch (error) {
      console.error('Retry payment error:', error.message, error.response?.data);
      return rejectWithValue(error.response?.data || { error: 'Payment retry failed' });
    }
  }
);

// Check payment status
export const checkPaymentStatus = createAsyncThunk(
  'payment/checkPaymentStatus',
  async (orderId, { rejectWithValue }) => {
    try {
      console.log('Checking payment status for order:', orderId);
      const response = await api.get(`/api/payment/mpesa/status/${orderId}`);
      console.log('Check payment status response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Check payment status error:', error.message, error.response?.data);
      return rejectWithValue(error.response?.data || { error: 'Failed to check payment status' });
    }
  }
);

// Fetch user orders
export const fetchUserOrders = createAsyncThunk(
  'payment/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching user orders');
      const response = await api.get('/api/orders/my-orders');
      console.log('Fetch user orders response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Fetch user orders error:', error.message, error.response?.data);
      return rejectWithValue(error.response?.data || { error: 'Failed to fetch orders' });
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    loading: false,
    error: null,
    orderCreationError: null,
    status: null,
    transactionId: null,
    checkoutRequestId: null,
    orders: [],
  },
  reducers: {
    resetPayment: (state) => {
      state.loading = false;
      state.error = null;
      state.orderCreationError = null;
      state.status = null;
      state.transactionId = null;
      state.checkoutRequestId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.orderCreationError = null;
      })
      .addCase(createOrder.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.orderCreationError = action.payload.error || 'Failed to create order';
      })
      .addCase(initiatePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = 'INITIATED';
      })
      .addCase(initiatePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload.status || 'INITIATED';
        state.transactionId = action.payload.data?.transaction_id;
        state.checkoutRequestId = action.payload.data?.CheckoutRequestID;
      })
      .addCase(initiatePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error || 'Payment initiation failed';
        state.status = 'FAILED';
      })
      .addCase(retryPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = 'retry_initiated';
      })
      .addCase(retryPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload.status || 'INITIATED';
        state.checkoutRequestId = action.payload.data?.CheckoutRequestID;
      })
      .addCase(retryPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error || 'Payment retry failed';
        state.status = 'FAILED';
      })
      .addCase(checkPaymentStatus.fulfilled, (state, action) => {
        state.status = action.payload.status;
        state.transactionId = action.payload.transaction_id;
      })
      .addCase(checkPaymentStatus.rejected, (state, action) => {
        state.error = action.payload.error || 'Failed to check payment status';
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.error = action.payload.error || 'Failed to fetch orders';
      });
  },
});

export const { resetPayment } = paymentSlice.actions;
export default paymentSlice.reducer;