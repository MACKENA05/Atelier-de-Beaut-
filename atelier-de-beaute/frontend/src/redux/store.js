import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import authReducer from './authSlice';
import productsReducer from './productsSlice';
import adminReducer from './adminSlice';

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const cartPersistConfig = {
  key: 'cart',
  storage,
};

const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);

const store = configureStore({
  reducer: {
    cart: persistedCartReducer,
    auth: authReducer,
    products: productsReducer,
    admin: adminReducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export default store;
