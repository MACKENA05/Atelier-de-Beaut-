import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  step: 1,
  orderData: null,
  isCheckingAuth: true,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setStep(state, action) {
      state.step = action.payload;
    },
    setOrderData(state, action) {
      state.orderData = action.payload;
    },
    setCheckingAuth(state, action) {
      state.isCheckingAuth = action.payload;
    },
    resetCheckout(state) {
      state.step = 1;
      state.orderData = null;
      state.isCheckingAuth = true;
    },
  },
});

export const { setStep, setOrderData, setCheckingAuth, resetCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;
