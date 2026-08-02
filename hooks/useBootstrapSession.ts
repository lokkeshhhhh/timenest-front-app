import { useEffect, useRef } from 'react';
import { AuthService } from '../services/auth';
import { applySessionData } from '../utils/session';
import { useAuthStore } from '../store/authStore';
import { useOrgStore } from '../store/orgStore';

/**
 * Refreshes org context + permissions from GET /auth/me, and the workspace
 * list from GET /auth/workspaces, once per authenticated session (cold start
 * / app resume). Both are read-only and failures are swallowed — a transient
 * network error here should never sign the user out or block the tab shell;
 * the locally persisted values just stay as they were.
 */
export function useBootstrapSession() {
  const token = useAuthStore((state) => state.token);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!token || hasRun.current) return;
    hasRun.current = true;
    refreshSession();
  }, [token]);
}

export async function refreshSession(): Promise<void> {
  try {
    const envelope = await AuthService.fetchMe();
    applySessionData(envelope.data ?? envelope);
  } catch {
    // keep last-known-good local state
  }

  try {
    const envelope = await AuthService.fetchMyOrganizations();
    const payload = envelope.data ?? envelope;
    useOrgStore.getState().setWorkspaces(Array.isArray(payload?.organizations) ? payload.organizations : []);
  } catch {
    // "switch workspace" just won't be offered if this fails
  }
}
