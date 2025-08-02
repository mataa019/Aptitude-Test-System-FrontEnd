import axios from 'axios';

// Basic configuration - Using Vite proxy to avoid CORS issues
const API_BASE_URL = '/api';

// Create axios instance with CORS handling
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
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
  get: () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },
  set: (userData: any) => localStorage.setItem('userData', JSON.stringify(userData)),
  remove: () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userData');
  },
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
