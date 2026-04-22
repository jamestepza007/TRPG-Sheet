import axios from 'axios';

// VITE_API_URL must be set in Vercel environment variables
// e.g. https://your-backend.railway.app/api
const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  console.error('[API] VITE_API_URL is not set! Requests will fail.');
}

const api = axios.create({
  baseURL: baseURL || 'http://localhost:3001/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Only redirect on 401 if we're NOT on the login page already
    if (err.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
