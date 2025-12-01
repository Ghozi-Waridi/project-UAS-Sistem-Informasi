import api from '../config/api';

/**
 * Evaluation Service
 * Handles evaluation inputs from Decision Makers
 */

// Submit pairwise comparison (for AHP)
export const submitPairwise = async (projectId, pairwiseData) => {
  try {
    const response = await api.post(`/projects/${projectId}/pairwise`, pairwiseData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get pairwise submissions for project
export const getPairwiseSubmissions = async (projectId) => {
  try {
    const response = await api.get(`/projects/${projectId}/pairwise`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Submit direct weights
export const submitDirectWeights = async (projectId, weightsData) => {
  try {
    const response = await api.post(`/projects/${projectId}/direct-weights`, weightsData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get direct weights for project
export const getDirectWeights = async (projectId) => {
  try {
    const response = await api.get(`/projects/${projectId}/direct-weights`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Submit scores for alternatives
export const submitScores = async (projectId, scoresData) => {
  try {
    const response = await api.post(`/projects/${projectId}/scores`, scoresData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Submit single score
export const submitScore = async (projectId, scoreData) => {
  try {
    const response = await api.post(`/projects/${projectId}/score`, scoreData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get scores for project
export const getScores = async (projectId) => {
  try {
    const response = await api.get(`/projects/${projectId}/scores`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
