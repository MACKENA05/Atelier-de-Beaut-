import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// Async thunk to fetch all categories
export const fetchCategories = createAsyncThunk('products/fetchCategories', async () => {
  const response = await api.get('/products/categories');
  return response.data;
});

// Async thunk to fetch products by category id with pagination and optional search term and price order
export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async ({ categoryId, page = 1, per_page = 20, searchTerm = '', priceOrder = '' }) => {
    const params = { page, per_page };
    if (searchTerm) {
      params.search = searchTerm;
    }
    if (priceOrder) {
      params.priceOrder = priceOrder;
    }
    const response = await api.get(`/products/categories/${categoryId}/products`, { params });
    return response.data;
  }
);

// Async thunk to fetch products by search term with pagination and price order
export const fetchProductsBySearch = createAsyncThunk(
  'products/fetchProductsBySearch',
  async ({ searchTerm, page = 1, per_page = 20, priceOrder = '' }) => {
    const params = { page, per_page, search: searchTerm };
    if (priceOrder) {
      params.priceOrder = priceOrder;
    }
    const response = await api.get('/products', { params });
    return response.data;
  }
);

// Async thunk to fetch products with pagination and price order
export const fetchProducts = createAsyncThunk('products/fetchProducts', async ({ page = 1, per_page = 20, priceOrder = '' } = {}) => {
  const params = { page, per_page };
  if (priceOrder) {
    params.priceOrder = priceOrder;
  }
  const response = await api.get('/products', { params });
  return response.data;
});

export const addProduct = createAsyncThunk('products/addProduct', async (product) => {
  const response = await api.post('/products', product);
  return response.data;
});

export const updateProduct = createAsyncThunk('products/updateProduct', async (product) => {
  const response = await api.put(`/products/${product.slug}`, product);
  return response.data;
});

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (slug) => {
  await api.delete(`/products/${slug}`);
  return slug;
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    categories: [],
    selectedCategory: null,
    searchTerm: '',
    total: 0,
    pages: 0,
    current_page: 1,
    per_page: 20,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedCategory(state, action) {
      state.selectedCategory = action.payload;
    },
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload.items;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
        state.current_page = action.payload.current_page;
        state.per_page = action.payload.per_page;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.loading = false;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.products = action.payload.products.items;
        state.total = action.payload.products.total;
        state.pages = action.payload.products.pages;
        state.current_page = action.payload.products.current_page;
        state.per_page = action.payload.products.per_page;
        state.loading = false;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchProductsBySearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsBySearch.fulfilled, (state, action) => {
        state.products = action.payload.items;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
        state.current_page = action.payload.current_page;
        state.per_page = action.payload.per_page;
        state.loading = false;
      })
      .addCase(fetchProductsBySearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p.slug === action.payload.slug);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p.slug !== action.payload);
      });
  },
});

export const { setSelectedCategory, setSearchTerm } = productSlice.actions;

export default productSlice.reducer;
