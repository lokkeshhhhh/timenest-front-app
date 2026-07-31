import { create } from 'zustand';

interface OrgState {
  activeOrg: any;
}

export const useOrgStore = create<OrgState>((set) => ({
  activeOrg: null,
}));
