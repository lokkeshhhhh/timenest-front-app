/**
 * Exact permission-name strings the backend returns in permissions[].
 * Single source of truth so screens never hand-type these — mirrors
 * App\Enums\SystemPermission on the backend.
 */
export const PERMISSIONS = {
  ATTENDANCE_VIEW: 'attendance.view',
  ATTENDANCE_APPROVE: 'attendance.approve',
  ATTENDANCE_APPROVE_ANY: 'attendance.approve_any',
  WORKLOG_VIEW: 'worklog.view',
  WORKLOG_APPROVE: 'worklog.approve',
  WORKLOG_APPROVE_ANY: 'worklog.approve_any',
  LEAVES_VIEW: 'leaves.view',
  LEAVES_APPROVE: 'leaves.approve',
  LEAVES_APPROVE_ANY: 'leaves.approve_any',
  INVITATIONS_VIEW: 'invitations.view',
  USERS_MANAGE: 'users.manage',
  USERS_VIEW: 'users.view',
  SETTINGS_MANAGE: 'settings.manage',
} as const;
