import { create } from "zustand";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "superadmin";
};

interface AuthStore {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void; // <-- add this
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
