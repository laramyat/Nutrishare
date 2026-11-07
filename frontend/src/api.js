import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Bearer Token Authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nutri_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Image URL
export const imageUrl = (path) => {
  if (!path) {
    return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd';
  }

  if (path.startsWith('http')) {
    return path;
  }

  return `http://127.0.0.1:8000/storage/${path}`;
};

export default api;