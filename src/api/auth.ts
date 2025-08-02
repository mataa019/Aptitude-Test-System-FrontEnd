import axios from './axios';

// Authentication API endpoints

// Login endpoint
export const login = async (credentials: { email: string; password: string }) => {
  const response = await axios.post('/auth/login', credentials);
  return response.data;
};

// Register endpoint
export const register = async (userData: { 
  email: string; 
  password: string; 
  firstName: string; 
  lastName: string; 
}) => {
  const response = await axios.post('/auth/register', userData);
  return response.data;
};

// Logout endpoint (if needed)
export const logout = async (token: string) => {
  const response = await axios.post('/auth/logout', {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Refresh token endpoint (if needed)
export const refreshToken = async (token: string) => {
  const response = await axios.post('/auth/refresh', {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
