import axios from 'axios';

const API_BASE_URL = "http://localhost:5000/api"; // Adjust the base URL as needed

export const fetchCategories = async () => {
  try {
    const response = await axios.get(API_BASE_URL + "/categories");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchProducts = async () => {
  try {
    const response = await axios.get(API_BASE_URL + "/products");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Cart API functions

export const fetchCart = async () => {
  try {
    const response = await axios.get(API_BASE_URL + "/cart");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addCartItem = async (product) => {
  try {
    const response = await axios.post(API_BASE_URL + "/cart", product);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCartItem = async (id, quantity) => {
  try {
    const response = await axios.put(API_BASE_URL + `/cart/${id}`, { quantity });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeCartItem = async (id) => {
  try {
    const response = await axios.delete(API_BASE_URL + `/cart/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add funds to user wallet
export const addFundsToWallet = async (amount) => {
  try {
    const response = await axios.post(API_BASE_URL + "/wallet/add-funds", { amount });
    return response.data;
  } catch (error) {
    throw error;
  }
};
