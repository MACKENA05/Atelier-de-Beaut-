import api from './api';

// API call to get all categories
export const fetchCategories = () => api.get('/products/categories');

// API call to get products by category id with pagination and optional search term
export const fetchProductsByCategory = ({ categoryId, page = 1, per_page = 20, searchTerm = '' }) => {
  const params = { page, per_page };
  if (searchTerm) {
    params.search = searchTerm;
  }
  return api.get(`/products/categories/${categoryId}/products`, { params });
};

// API call to get products by search term with pagination
export const fetchProductsBySearch = ({ searchTerm, page = 1, per_page = 20 }) => {
  const params = { page, per_page, search: searchTerm };
  return api.get('/products', { params });
};
