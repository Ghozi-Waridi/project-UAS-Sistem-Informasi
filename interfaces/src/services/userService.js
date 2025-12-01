import api from '../config/api';

/**
 * User Service
 * Handles user operations
 */

// Create Decision Maker user
export const createDecisionMaker = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get user profile by ID
export const getUserProfile = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
// Get all Decision Makers for company
export const getDMs = async () => {
  try {
    const response = await api.get('/users/dms');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
