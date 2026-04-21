import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://real-estate-crm-71em.vercel.app',
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
