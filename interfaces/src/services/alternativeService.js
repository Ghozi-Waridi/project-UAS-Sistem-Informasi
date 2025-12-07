import api from '../config/api';

/**
 * Alternative Service
 * Handles alternative/candidate operations for decision projects
 */

// Create new alternative (candidate) for project
export const createAlternative = async (projectId, alternativeData) => {
  try {
    const response = await api.post(`/projects/${projectId}/alternatives`, alternativeData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get all alternatives for project
export const getAlternativesByProject = async (projectId) => {
  try {
    const response = await api.get(`/projects/${projectId}/alternatives`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
// Update alternative
export const updateAlternative = async (projectId, alternativeId, data) => {
  try {
    const response = await api.put(`/projects/${projectId}/alternatives/${alternativeId}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete alternative
export const deleteAlternative = async (projectId, alternativeId) => {
  try {
    const response = await api.delete(`/projects/${projectId}/alternatives/${alternativeId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
