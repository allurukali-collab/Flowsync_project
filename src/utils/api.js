import axios from 'axios';

// Base URL configuration
const API_BASE_URL = 'http://localhost:8080';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request
api.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('token');
    if (!token) {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        token = user?.token;
      } catch {
        token = null;
      }
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401/403 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.hash = '#/';
    }
    return Promise.reject(error);
  }
);

export function getAuthHeaders() {
  const token = localStorage.getItem('token') || JSON.parse(localStorage.getItem('user') || '{}')?.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default api;