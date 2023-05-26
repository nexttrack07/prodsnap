import { UserCredential } from "firebase/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LoginState {
  isAuthenticated: boolean;
  user: UserCredential | null;
  setUser: (user: UserCredential | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const useLoginStore = create<LoginState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      setUser: (user: UserCredential | null) => set({ user }),
      setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
    }),
  { name: 'login'}
))