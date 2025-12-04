import axios from "axios";

// Base URL for API
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://10.90.33.224:8084/api/v1";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor - Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response && error.response.status === 401) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      window.location.href = "/login";
    }

    // Handle other errors
    const errorMessage =
      error.response?.data?.message || error.message || "An error occurred";
    console.error("API Error:", errorMessage);

    return Promise.reject(error);
  },
);

export default api;
