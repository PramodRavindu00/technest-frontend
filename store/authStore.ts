import { create } from "zustand";
import { Role } from "@/constants/enum";
import { access } from "fs";

interface User {
  id: string;
  email: string;
  role: Role;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (accessToken: string, user: User) => void;
  updateToken: (accessToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,

  setAuth: (accessToken, user) =>
    set({ accessToken, user, isAuthenticated: true }),
  updateToken: (accessToken) => set({ accessToken }),
  clearAuth: () =>
    set({ accessToken: null, user: null, isAuthenticated: false }),
}));
