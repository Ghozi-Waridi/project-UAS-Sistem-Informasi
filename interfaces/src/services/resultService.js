import api from '../config/api';

/**
 * Result Service
 * Handles calculation triggering and result retrieval
 */

// Trigger calculation (Admin only)
export const triggerCalculation = async (projectId) => {
   try {
      const response = await api.post(`/projects/${projectId}/calculate`);
      return response.data;
   } catch (error) {
      throw error.response?.data || error;
   }
};

// Get results for a project
export const getResults = async (projectId) => {
   try {
      const response = await api.get(`/projects/${projectId}/results`);
      return response.data;
   } catch (error) {
      throw error.response?.data || error;
   }
};
