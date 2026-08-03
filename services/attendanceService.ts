import { api } from './api';

export interface ClockLocation {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
}

// Matches App\Enums\AttendanceSessionSourceEnum::MOBILE on the backend —
// this is the mobile app, regardless of which platform it's running on.
const CLOCK_SOURCE_MOBILE = 1;

// NOTE: these all live under the /organization prefix on the backend
// (routes/api/v1/organization.php -> attendance.php), which is what wires
// up the tm.jwt.auth + tenant.resolve middleware that populates JwtContext.
// There's a separate, older /api/v1/attendance/* route (routes/api.php)
// using a different auth guard that never binds that context — hitting it
// by mistake is what "Unauthenticated. JWT context missing." was.
const BASE = '/api/v1/organization/attendance';

export const attendanceService = {
  /** Read-only today status: null data + message if nothing recorded yet. */
  getToday: async () => {
    const response = await api.get(`${BASE}/today`);
    return response.data;
  },

  clockIn: async (location: ClockLocation) => {
    const response = await api.post(`${BASE}/clock-in`, {
      clock_in_source: CLOCK_SOURCE_MOBILE,
      clock_in_latitude: location.latitude,
      clock_in_longitude: location.longitude,
      clock_in_accuracy: location.accuracy ?? null,
    });
    return response.data;
  },

  clockOut: async (location: ClockLocation) => {
    const response = await api.post(`${BASE}/clock-out`, {
      clock_out_source: CLOCK_SOURCE_MOBILE,
      clock_out_latitude: location.latitude,
      clock_out_longitude: location.longitude,
      clock_out_accuracy: location.accuracy ?? null,
    });
    return response.data;
  },
};
