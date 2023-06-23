import { create } from "zustand";
import { UserCredential } from "firebase/auth";

export type AuthState = {
  loading: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  isLoggedIn: () => boolean;
}

export type User = UserCredential["user"];

export const useAuthStore = create<AuthState>((set, get) => ({
  loading: false,
  user: null,
  setUser: (user) => set({ user: user }),
  setLoading: (loading) => set({ loading }),
  isLoggedIn: () => get().user !== null,
}))