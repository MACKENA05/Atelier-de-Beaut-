import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || '/api', // backend URL configurable via env or relative path
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

let logoutHandler = null;

// Add a response interceptor to catch 401 errors and trigger logout
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      if (logoutHandler) {
        logoutHandler();
      }
    }
    return Promise.reject(error);
  }
);

export function setLogoutHandler(handler) {
  logoutHandler = handler;
}

export default api;
