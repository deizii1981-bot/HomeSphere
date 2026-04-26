import axios from 'axios';

const api = axios.create({
  baseURL: '/',
});

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    // If the backend returns our standard JSON format `{ success: true, data: ... }`
    if (response.data && response.data.success !== undefined) {
      if (response.data.success) {
        // Automatically unwrap the 'data' field so components get the actual content
        return { data: response.data.data };
      } else {
        return Promise.reject(new Error(response.data.message || 'Error occurred'));
      }
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear localStorage and redirect to login
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Pass standard format error messages if present
    if (error.response && error.response.data && !error.response.data.success) {
      return Promise.reject({ ...error, message: error.response.data.message });
    }

    return Promise.reject(error);
  }
);

export default api;
