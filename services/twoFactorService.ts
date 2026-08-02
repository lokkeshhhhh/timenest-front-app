import { api } from './api';

export const twoFactorService = {
  getStatus: async () => {
    const response = await api.get('/api/v1/user/2fa/status');
    return response.data;
  },

  initiateSetup: async () => {
    const response = await api.post('/api/v1/user/2fa/setup/initiate');
    return response.data;
  },

  confirmSetup: async (code: string) => {
    const response = await api.post('/api/v1/user/2fa/setup/confirm', { code });
    return response.data;
  },

  disable: async (code: string) => {
    const response = await api.post('/api/v1/user/2fa/disable', { code });
    return response.data;
  },

  regenerateRecoveryCodes: async (code: string) => {
    const response = await api.post('/api/v1/user/2fa/recovery-codes/regenerate', { code });
    return response.data;
  },
};
