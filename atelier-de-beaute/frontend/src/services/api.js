import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust backend URL and prefix as needed
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token if available
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
