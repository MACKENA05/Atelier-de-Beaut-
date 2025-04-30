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
  throw new Error('fetchCart API not implemented');
};

export const addCartItem = async (product) => {
  throw new Error('addCartItem API not implemented');
};

export const updateCartItem = async (id, quantity) => {
  throw new Error('updateCartItem API not implemented');
};

export const removeCartItem = async (id) => {
  throw new Error('removeCartItem API not implemented');
};

export const fetchCategories = async () => {
  throw new Error('fetchCategories API not implemented');
};

export const fetchProducts = async () => {
  throw new Error('fetchProducts API not implemented');
};
