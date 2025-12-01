import api from '../config/api';

/**
 * Decision Service
 * Handles calculation triggers and result retrieval
 */

// Trigger calculation for project
export const triggerCalculation = async (projectId, calculationParams) => {
  try {
    const response = await api.post(`/projects/${projectId}/calculate`, calculationParams);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get calculation results
export const getResults = async (projectId) => {
  try {
    const response = await api.get(`/projects/${projectId}/results`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
