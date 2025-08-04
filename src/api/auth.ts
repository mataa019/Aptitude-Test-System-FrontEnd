import { api, token, user, handleError } from './config';

// Verify current token and get user data
export const verifyToken = async () => {
  try {
    const response = await api.get('/user/profile');
    const userData = response.data.data || response.data;
    
    // Update stored user data
    user.set(userData);
    
    return { user: userData };
  } catch (error: any) {
    // Token is invalid, clear it
    token.remove();
    user.remove();
    throw new Error(handleError(error));
  }
};

// Login function
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { message, access_token, user: userData } = response.data;
    
    // Store token and user data
    token.set(access_token);
    user.setId(userData.id);
    user.set(userData);
    
    return { token: access_token, user: userData, message };
  } catch (error: any) {
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
    // Test with a minimal login request to check if auth endpoint is working
    await api.post('/auth/login', { email: 'test', password: 'test' });
    return { status: 'connected', message: 'Backend is responding' };
  } catch (error: any) {
    // If we get a response (even error), it means the backend is working
    if (error.response && error.response.status) {
      return { status: 'connected', message: 'Backend is responding' };
    }
    throw new Error(handleError(error));
  }
};
