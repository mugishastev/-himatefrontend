import { create } from 'zustand';

interface UIState {
    isSidebarOpen: boolean;
    activeModal: string | null;
    currentView: 'CHATS' | 'CONTACTS' | 'PROFILE';
    toggleSidebar: () => void;
    openModal: (modalName: string) => void;
    closeModal: () => void;
    setView: (view: 'CHATS' | 'CONTACTS' | 'PROFILE') => void;
}

export const useUIStore = create<UIState>((set) => ({
    isSidebarOpen: true,
    activeModal: null,
    currentView: 'CHATS',
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    openModal: (modalName) => set({ activeModal: modalName }),
    closeModal: () => set({ activeModal: null }),
    setView: (view) => set({ currentView: view }),
}));
