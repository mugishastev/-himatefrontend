import { create } from 'zustand';
import type { User } from '../types/user.types';

interface UserState {
    contacts: User[];
    searchResults: User[];
    onlineUsers: string[]; // userIds
    setContacts: (contacts: User[]) => void;
    setSearchResults: (results: User[]) => void;
    setOnlineUsers: (userIds: string[]) => void;
    addContact: (user: User) => void;
    setIsLoading: (isLoading: boolean) => void;
    isLoading: boolean;
}

export const useUserStore = create<UserState>((set) => ({
    contacts: [],
    searchResults: [],
    onlineUsers: [],
    setContacts: (contacts) => set({ contacts }),
    setSearchResults: (results) => set({ searchResults: results }),
    setOnlineUsers: (userIds) => set({ onlineUsers: userIds }),
    addContact: (user) =>
        set((state) => ({
            contacts: state.contacts.some((c) => c.id === user.id)
                ? state.contacts
                : [...state.contacts, user],
        })),
    setIsLoading: (isLoading) => set({ isLoading }),
    isLoading: false,
}));
