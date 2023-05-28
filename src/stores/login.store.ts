import { User } from "@/pages";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LoginState {
  isAuthenticated: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const useLoginStore = create<LoginState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      setUser: (user: User | null) => set({ user }),
      setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
    }),
  { name: 'login'}
))