import { create } from 'zustand';
import type { User } from '../types/user.types';

interface UserState {
    searchResults: User[];
    onlineUsers: string[]; // userIds
    setSearchResults: (results: User[]) => void;
    setOnlineUsers: (userIds: string[]) => void;
    setIsLoading: (isLoading: boolean) => void;
    isLoading: boolean;
}

export const useUserStore = create<UserState>((set) => ({
    searchResults: [],
    onlineUsers: [],
    setSearchResults: (results) => set({ searchResults: results }),
    setOnlineUsers: (userIds) => set({ onlineUsers: userIds }),
    setIsLoading: (isLoading) => set({ isLoading }),
    isLoading: false,
}));
