import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/auth.types';
import { tokenStorage } from '../utils/token';

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    setAuth: (user: User, accessToken: string, refreshToken?: string) => void;
    logout: () => void;
    updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            setAuth: (user, accessToken, refreshToken) => {
                tokenStorage.setToken(accessToken);
                if (refreshToken) tokenStorage.setRefreshToken(refreshToken);
                set({ user, accessToken, refreshToken: refreshToken || null, isAuthenticated: true });
            },
            logout: () => {
                tokenStorage.clear();
                set({ user: null, accessToken: null, isAuthenticated: false });
            },
            updateUser: (userData) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...userData } : null,
                })),
        }),
        {
            name: 'himate-auth',
        }
    )
);
