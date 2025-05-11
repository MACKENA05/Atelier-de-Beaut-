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
  const { slug, ...productData } = product;
  const response = await api.put(`/products/${slug}`, productData);
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
    status: null,  // Added status field
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
        state.status = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload.items;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
        state.current_page = action.payload.current_page;
        state.per_page = action.payload.per_page;
        state.loading = false;
        state.status = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.status = null;
      })
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.loading = false;
        state.status = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.status = null;
      })
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.products = action.payload.products.items;
        state.total = action.payload.products.total;
        state.pages = action.payload.products.pages;
        state.current_page = action.payload.products.current_page;
        state.per_page = action.payload.products.per_page;
        state.loading = false;
        state.status = null;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.status = null;
      })
      .addCase(fetchProductsBySearch.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = null;
      })
      .addCase(fetchProductsBySearch.fulfilled, (state, action) => {
        state.products = action.payload.items;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
        state.current_page = action.payload.current_page;
        state.per_page = action.payload.per_page;
        state.loading = false;
        state.status = null;
      })
      .addCase(fetchProductsBySearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.status = null;
      })
      .addCase(addProduct.pending, (state) => {
        state.status = null;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
        state.status = 'add_success';
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.status = 'add_error';
        state.error = action.error.message;
      })
      .addCase(updateProduct.pending, (state) => {
        state.status = null;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p.slug === action.payload.slug);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        state.status = 'update_success';
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = 'update_error';
        state.error = action.error.message;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.status = null;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p.slug !== action.payload);
        state.status = 'delete_success';
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = 'delete_error';
        state.error = action.error.message;
      });
  },
});

export const { setSelectedCategory, setSearchTerm } = productSlice.actions;

export default productSlice.reducer;
