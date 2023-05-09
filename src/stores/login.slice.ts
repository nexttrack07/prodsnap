import { StateCreator } from "zustand";

export interface LoginState {
  isAuthenticated: boolean;
  user: { email: string; token: string };
  setUser: (user: { email: string, token: string }) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const loginSlice: StateCreator<LoginState> = (set) => ({
  isAuthenticated: false,
  user: { email: '', token: '' },
  setUser: (user: { email: string, token: string }) => set({ user }),
  setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
})