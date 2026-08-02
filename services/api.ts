import axios from 'axios';
import { CONFIG } from '../constants/config';
import { useAuthStore } from '../store/authStore';

export const api = axios.create({
  baseURL: CONFIG.API_URL,
});

// Attach the bearer token for every request, unless the caller already set an
// explicit Authorization header (temp-token flows like select-organization/2fa
// pass their own short-lived token that must win over the persisted session one).
api.interceptors.request.use(config => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers = config.headers ?? {};
    if (!config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
