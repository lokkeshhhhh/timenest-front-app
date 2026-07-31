import axios from 'axios';
import { CONFIG } from '../constants/config';

export const api = axios.create({
  baseURL: CONFIG.API_URL,
});

api.interceptors.request.use(config => {
  // attach token, org header
  return config;
});
