import api from '../config/api';

/**
 * Criteria Service
 * Handles criteria operations for decision projects
 */

// Create new criteria for project
export const createCriteria = async (projectId, criteriaData) => {
  try {
    const response = await api.post(`/projects/${projectId}/criteria`, criteriaData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get all criteria for project
export const getCriteriaByProject = async (projectId) => {
  try {
    const response = await api.get(`/projects/${projectId}/criteria`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
// Update criteria
export const updateCriteria = async (projectId, criteriaId, data) => {
  try {
    const response = await api.put(`/projects/${projectId}/criteria/${criteriaId}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete criteria
export const deleteCriteria = async (projectId, criteriaId) => {
  try {
    const response = await api.delete(`/projects/${projectId}/criteria/${criteriaId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
