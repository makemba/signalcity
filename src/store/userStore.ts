
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserState {
  user: {
    id?: string;
    email?: string;
    role?: 'super_admin' | 'admin' | 'moderator' | 'user';
    name?: string;
  } | null;
  isAuthenticated: boolean;
  setUser: (user: UserState['user']) => void;
  clearUser: () => void;
  setRole: (role: 'super_admin' | 'admin' | 'moderator' | 'user') => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      clearUser: () => set({ user: null, isAuthenticated: false }),
      setRole: (role) => set((state) => ({
        user: { ...state.user, role }
      })),
    }),
    {
      name: 'user-storage',
    }
  )
);
