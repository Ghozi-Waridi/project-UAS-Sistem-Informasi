import api from '../config/api';


// Register new user
export const register = async (userData) => {
  try {
    console.log('Attempting registration with data:', userData);
    const response = await api.post('/auth/register', userData);
    console.log('Registration successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Registration error details:', error);
    console.error('Error response:', error.response);
    console.error('Error message:', error.message);
    throw error.response?.data || error;
  }
};

// Login user
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);

    // Store token and user data in sessionStorage (tab-specific)
    if (response.data.token) {
      sessionStorage.setItem('token', response.data.token);
      if (response.data.user) {
        sessionStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Logout user
export const logout = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
};

// Get current user from sessionStorage
export const getCurrentUser = () => {
  const userStr = sessionStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!sessionStorage.getItem('token');
};
