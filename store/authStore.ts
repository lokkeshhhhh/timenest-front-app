import { create } from 'zustand';

interface AuthState {
  user: any;
  token: string | null;
  tempToken: string | null;
  tempWorkspaces: any[];
  setAuth: (token: string, user: any) => void;
  setTempAuth: (tempToken: string, workspaces: any[]) => void;
  clearTempAuth: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  tempToken: null,
  tempWorkspaces: [],
  setAuth: (token, user) => set({ token, user }),
  setTempAuth: (tempToken, workspaces) => set({ tempToken, tempWorkspaces: workspaces }),
  clearTempAuth: () => set({ tempToken: null, tempWorkspaces: [] }),
  logout: () => set({ user: null, token: null, tempToken: null, tempWorkspaces: [] }),
}));
