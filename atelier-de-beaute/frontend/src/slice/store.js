import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import productReducer from './productSlice';
import cartReducer from './cartSlice';
import userReducer from './userSlice';
import analyticsReducer from './analyticsSlice';
import reviewReducer from './reviewSlice';
import orderReducer from './orderSlice';
import userAdminReducer from './userAdminSlice';
import invoiceReducer from './invoiceSlice';



export default configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    users: userReducer,
    analytics: analyticsReducer,
    reviews: reviewReducer,
    orders: orderReducer,
    userAdmin: userAdminReducer,
    invoices: invoiceReducer,
  },
});
