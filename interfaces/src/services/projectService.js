import api from '../config/api';

/**
 * Project Service
 * Handles project/decision project operations
 */

// Create new project
export const createProject = async (projectData) => {
  try {
    const response = await api.post('/projects', projectData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get all projects for company
export const getProjects = async () => {
  try {
    const response = await api.get('/projects');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get project by ID
export const getProjectById = async (projectId) => {
  try {
    const response = await api.get(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Assign Decision Maker to project
export const assignDecisionMaker = async (projectId, dmData) => {
  try {
    const response = await api.post(`/projects/${projectId}/assign-dm`, dmData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get Decision Makers assigned to project
export const getProjectDecisionMakers = async (projectId) => {
  try {
    const response = await api.get(`/projects/${projectId}/decision-makers`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update project
export const updateProject = async (projectId, projectData) => {
  try {
    const response = await api.put(`/projects/${projectId}`, projectData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete project
export const deleteProject = async (projectId) => {
  try {
    const response = await api.delete(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
// Remove Decision Maker from project
export const removeDecisionMaker = async (projectId, dmUserId) => {
  try {
    const response = await api.delete(`/projects/${projectId}/decision-makers/${dmUserId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update Decision Maker assignment (method and weight)
export const updateDecisionMaker = async (projectId, projectDmId, data) => {
  try {
    const response = await api.put(`/projects/${projectId}/decision-makers/${projectDmId}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get projects assigned to the current DM
export const getAssignedProjects = async () => {
  try {
    const response = await api.get('/projects/assigned');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
