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

import { toast } from 'sonner';

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isBrowser = typeof window !== 'undefined';
    const isOffline = isBrowser && !window.navigator.onLine;
    const isNetworkError = error.code === 'ERR_NETWORK' || error.message === 'Network Error' || !error.response;
    const isProxyServerError = error.response?.status >= 500 && error.response?.status <= 504;

    if (isOffline || isNetworkError || isProxyServerError) {
      if (isBrowser && isOffline) {
        toast.error('Network Unavailable', {
          description: 'No internet connection detected. Your session has been preserved.',
          id: 'offline-api-error',
        });
      }
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      if (isBrowser) {
        const isSecuredAdmin = window.location.pathname.startsWith('/admin') || window.location.pathname.startsWith('/secured-admin');
        window.location.href = isSecuredAdmin ? '/secured-admin/login' : '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
