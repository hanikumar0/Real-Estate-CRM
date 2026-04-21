import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor for standardized error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Standardize error messaging for UI toasts
    const message = error.response?.data?.message || error.message || 'System unavailable';
    return Promise.reject(new Error(message));
  }
);

export default api;
