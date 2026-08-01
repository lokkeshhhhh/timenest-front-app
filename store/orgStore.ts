import { create } from 'zustand';

interface OrgState {
  activeOrg: any;
  setActiveOrg: (org: any) => void;
}

export const useOrgStore = create<OrgState>((set) => ({
  activeOrg: null,
  setActiveOrg: (org) => set({ activeOrg: org }),
}));
