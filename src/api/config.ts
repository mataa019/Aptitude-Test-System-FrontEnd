import axios from 'axios';

// Basic configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
export const token = {
  get: () => localStorage.getItem('authToken'),
  set: (token: string) => localStorage.setItem('authToken', token),
  remove: () => localStorage.removeItem('authToken'),
};

// User management
export const user = {
  getId: () => localStorage.getItem('userId'),
  setId: (id: string) => localStorage.setItem('userId', id),
  remove: () => localStorage.removeItem('userId'),
};

// Add token to all requests
api.interceptors.request.use((config) => {
  const authToken = token.get();
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      token.remove();
      user.remove();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Error handler utility
export const handleError = (error: any): string => {
  return error.response?.data?.message || error.message || 'Something went wrong';
};
