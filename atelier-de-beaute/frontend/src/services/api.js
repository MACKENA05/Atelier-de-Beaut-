import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Adjust base URL as needed

export const fetchTestimonials = async () => {
  try {
    const response = await axios.get(API_BASE_URL + '/api/testimonials');
    return response.data;
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    throw error;
  }
};

export const fetchCart = async () => {
  try {
    const response = await axios.get(API_BASE_URL + '/api/cart');
    return response.data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

export const addCartItem = async (product) => {
  try {
    const response = await axios.post(API_BASE_URL + '/api/cart', product);
    return response.data;
  } catch (error) {
    console.error('Error adding cart item:', error);
    throw error;
  }
};

export const updateCartItem = async (id, quantity) => {
  try {
    const response = await axios.put(API_BASE_URL + `/api/cart/${id}`, { quantity });
    return response.data;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

export const removeCartItem = async (id) => {
  try {
    const response = await axios.delete(API_BASE_URL + `/api/cart/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error removing cart item:', error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await axios.get(API_BASE_URL + '/api/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const fetchProducts = async () => {
  try {
    const response = await axios.get(API_BASE_URL + '/api/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};
