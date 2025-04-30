import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Adjust the base URL as needed

export const fetchCategories = async () => {
  try {
    const response = await axios.get(\`\${API_BASE_URL}/categories\`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchProducts = async () => {
  try {
    const response = await axios.get(\`\${API_BASE_URL}/products\`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
