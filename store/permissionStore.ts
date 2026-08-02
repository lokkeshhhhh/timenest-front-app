import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PermissionState {
  permissions: string[];
  setPermissions: (permissions: string[]) => void;
  clear: () => void;
}

export const usePermissionStore = create<PermissionState>()(
  persist(
    (set) => ({
      permissions: [],
      setPermissions: (permissions) => set({ permissions }),
      clear: () => set({ permissions: [] }),
    }),
    {
      name: 'permission-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

/**
 * The single gating mechanism for permission-based UI. Always gate on the
 * permission string, never on role/role_label — roles are display-only.
 */
export function usePermission(permission: string): boolean {
  return usePermissionStore((state) => state.permissions.includes(permission));
}

/** True if the user holds at least one of the given permissions. */
export function useAnyPermission(permissions: string[]): boolean {
  return usePermissionStore((state) => permissions.some((p) => state.permissions.includes(p)));
}

/** Non-reactive check for use outside render (navigation guards, handlers). */
export function hasPermission(permission: string): boolean {
  return usePermissionStore.getState().permissions.includes(permission);
}
