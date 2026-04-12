import axios from 'axios';
import type { AxiosError, AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_GATEWAY_URL || 'https://localhost:7217';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
  withCredentials: false
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    
    console.log('🚀', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('✅', response.status, response.config.url);
    return response;
  },
  (error: AxiosError) => {
    console.error('❌', error.response?.status || 'Network Error', error.config?.url);
    return Promise.reject(error);
  }
);

export { api };
export default api;
