import { create } from 'zustand';

interface PermissionState {
  permissions: string[];
}

export const usePermissionStore = create<PermissionState>((set) => ({
  permissions: [],
}));
