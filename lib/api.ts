import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const api = axios.create({
  baseURL: '/api/app',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // Note: The Authorization header is NO LONGER attached here. 
    // The Next.js BFF proxy automatically extracts the HttpOnly 'c9_session' cookie 
    // and attaches the real raw Authorization header backend-side, hiding it from the browser.
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      if (typeof window !== 'undefined') {
        const isSecuredAdmin = window.location.pathname.startsWith('/admin') || window.location.pathname.startsWith('/secured-admin');
        window.location.href = isSecuredAdmin ? '/secured-admin/login' : '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
