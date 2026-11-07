
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';
const BACKEND_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Attach authentication token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nutri_token');

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle API errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(
        'API Error:',
        error.response.status,
        error.response.data
      );
    } else {
      console.error('Network Error:', error.message);
    }

    return Promise.reject(error);
  }
);

// Convert Laravel storage image path to full URL
export const imageUrl = (path) => {
  const fallback =
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd';

  if (!path) return fallback;

  if (typeof path !== 'string') return fallback;

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const cleanPath = path.replace(/^\/+/, '');

  if (cleanPath.startsWith('storage/')) {
    return `${BACKEND_URL}/${cleanPath}`;
  }

  return `${BACKEND_URL}/storage/${cleanPath}`;
};

export default api;
