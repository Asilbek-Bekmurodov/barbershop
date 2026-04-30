import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api, { mapUser } from '@/lib/api';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/login', { email, password });
          const { user: rawUser, token } = response.data.data;
          const user = mapUser(rawUser);
          if (typeof window !== 'undefined') {
            localStorage.setItem('trimflow_token', token);
          }
          set({ user, token, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      loginWithGoogle: async () => {
        if (typeof window !== 'undefined') {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
          window.location.href = `${apiUrl}/auth/google`;
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/register', { name, email, password });
          const { user: rawUser, token } = response.data.data;
          const user = mapUser(rawUser);
          if (typeof window !== 'undefined') {
            localStorage.setItem('trimflow_token', token);
          }
          set({ user, token, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('trimflow_token');
        }
        set({ user: null, token: null });
      },

      setUser: (user: User) => {
        set({ user });
      },
    }),
    {
      name: 'trimflow-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
