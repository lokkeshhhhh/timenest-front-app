import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OrgSummary {
  uuid?: string;
  organization_uuid?: string;
  legal_name?: string;
  trading_name?: string;
  slug?: string;
  logo_url?: string | null;
  type?: string | null;
  type_label?: string | null;
  role?: string;
}

interface OrgState {
  /** The organization the current access token is scoped to (null = no active org, e.g. freelancer). */
  activeOrg: OrgSummary | null;
  role: string | null;
  roleLabel: string | null;
  /** All organizations the user belongs to — populated from GET /auth/workspaces, used to gate "switch workspace". */
  workspaces: OrgSummary[];
  setContext: (ctx: { organization: OrgSummary | null; role: string | null; roleLabel: string | null }) => void;
  setWorkspaces: (workspaces: OrgSummary[]) => void;
  clear: () => void;
}

export const useOrgStore = create<OrgState>()(
  persist(
    (set) => ({
      activeOrg: null,
      role: null,
      roleLabel: null,
      workspaces: [],
      setContext: ({ organization, role, roleLabel }) =>
        set({ activeOrg: organization, role, roleLabel }),
      setWorkspaces: (workspaces) => set({ workspaces }),
      clear: () => set({ activeOrg: null, role: null, roleLabel: null, workspaces: [] }),
    }),
    {
      name: 'org-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const useIsMultiOrg = () => useOrgStore((state) => state.workspaces.length > 1);
