import { api } from './api';

export const worklogService = {
  /** All worklogs visible to the current user (own only, unless they hold worklog.view/approve org-wide). */
  list: async () => {
    const response = await api.get('/api/v1/organization/attendance/worklogs');
    return response.data;
  },
};
