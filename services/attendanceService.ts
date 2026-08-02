import { api } from './api';

export const attendanceService = {
  /** Read-only today status: null data + message if nothing recorded yet. */
  getToday: async () => {
    const response = await api.get('/api/v1/attendance/today');
    return response.data;
  },
};
