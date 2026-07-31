import { create } from 'zustand';

interface AuthState {
  user: any;
  token: string | null;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
}));
