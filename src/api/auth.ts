import { api, token, user, handleError } from './config';

// Login function
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { message, access_token, user: userData } = response.data;
    
    // Store token and user ID
    token.set(access_token);
    user.setId(userData.id);
    
    return { token: access_token, user: userData, message };
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Register function
export const register = async (name: string, email: string, password: string) => {
  try {
    const response = await api.post('/auth/register', { name, email, password });
    const { message, data: userData } = response.data;
    
    // Registration doesn't return a token, just user data
    // User needs to login after registration
    return { message, user: userData };
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Logout function
export const logout = () => {
  token.remove();
  user.remove();
  window.location.href = '/';
};

// Test backend connection
export const testConnection = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};
