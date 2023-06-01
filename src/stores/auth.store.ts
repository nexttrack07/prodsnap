// import { User } from "@/pages";
import { create } from "zustand";

export type AuthState = {
  allUserData: User | null;
  loading: boolean;
  user: () => { user_id: number | null; username: string | null };
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  isLoggedIn: () => boolean;
}

export type User = {
  user_id: number;
  username: string;
  email?: string;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  allUserData: null,
  loading: false,
  user: () => ({
    user_id: get().allUserData?.user_id || null,
    username: get().allUserData?.username || null,
  }),
  setUser: (user) => set({ allUserData: user }),
  setLoading: (loading) => set({ loading }),
  isLoggedIn: () => get().allUserData !== null,
}))