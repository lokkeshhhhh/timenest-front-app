import { useAuthStore } from '../store/authStore';
import { useOrgStore, OrgSummary } from '../store/orgStore';
import { usePermissionStore } from '../store/permissionStore';

/** Shape shared by login / select-organization / switch-organization / me responses. */
export interface SessionResponseData {
  access_token?: string;
  user?: any;
  organization?: OrgSummary | null;
  role?: string | null;
  role_label?: string | null;
  permissions?: string[];
}

/**
 * Single place that fans a backend auth response out to the three session
 * stores (auth/org/permission), so every call site — login, select-org,
 * switch-org, /me refresh — stays in sync instead of hand-rolling this.
 */
export function applySessionData(data: SessionResponseData): void {
  if (data.access_token && data.user) {
    useAuthStore.getState().setAuth(data.access_token, data.user);
  } else if (data.user) {
    useAuthStore.getState().setUser(data.user);
  }

  useOrgStore.getState().setContext({
    organization: data.organization ?? null,
    role: data.role ?? null,
    roleLabel: data.role_label ?? null,
  });

  usePermissionStore.getState().setPermissions(data.permissions ?? []);
}

/** Clears all session state on sign-out. */
export function clearSession(): void {
  useAuthStore.getState().logout();
  useOrgStore.getState().clear();
  usePermissionStore.getState().clear();
}
