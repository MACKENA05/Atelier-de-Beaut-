import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Adjust base URL as needed

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to include the Authorization header with token
apiClient.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user');
    if (user) {
      const token = JSON.parse(user).access_token || JSON.parse(user).token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
