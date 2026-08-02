import { api } from './api';

export const AuthService = {
  fetchAccountTypes: async () => {
    const response = await api.get('/api/v1/auth/account-types');
    return response.data;
  },
  
  register: async (payload: any) => {
    const response = await api.post('/api/v1/auth/register', payload);
    return response.data;
  },
  
  verifyEmail: async (token: string) => {
    const response = await api.post('/api/v1/auth/verify-email', { token });
    return response.data;
  },
  
  login: async (email: string, password: string) => {
    const response = await api.post('/api/v1/auth/login', { email, password });
    return response.data;
  },
  
  requestPasswordReset: async (email: string) => {
    const response = await api.post('/api/v1/auth/forgot-password', { email });
    return response.data;
  },
  
  resetPassword: async (payload: any) => {
    const response = await api.post('/api/v1/auth/reset-password', payload);
    return response.data;
  },
  
  submitTwoFactorCode: async (tempToken: string, code: string) => {
    const response = await api.post('/api/v1/auth/2fa/verify', { code }, {
      headers: { Authorization: `Bearer ${tempToken}` }
    });
    return response.data;
  },
  
  selectOrganization: async (tempToken: string, organizationUuid: string) => {
    const response = await api.post('/api/v1/auth/select-organization', { organization_uuid: organizationUuid }, {
      headers: { Authorization: `Bearer ${tempToken}` }
    });
    return response.data;
  },
  
  fetchMyOrganizations: async () => {
    const response = await api.get('/api/v1/auth/workspaces');
    return response.data;
  },
  
  validateInvitationToken: async (token: string) => {
    const response = await api.get(`/api/v1/invitations/validate/${token}`);
    return response.data;
  },
  
  acceptInvitation: async (payload: any) => {
    const response = await api.post('/api/v1/invitations/accept', payload);
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/api/v1/auth/logout');
    return response.data;
  }
};
