import axios from 'axios';

/**
 * Axios instance pre-configured with the backend base URL.
 * The request interceptor automatically attaches the JWT from
 * localStorage to every outgoing request as a Bearer token.
 */
const api = axios.create({
  baseURL: 'http://localhost:5000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
