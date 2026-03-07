import { create } from 'zustand';

interface UIState {
    isSidebarOpen: boolean;
    activeModal: string | null;
    viewingUserId: string | number | null;
    currentView: 'CHATS' | 'STATUS' | 'CONTACTS' | 'NOTIFICATIONS' | 'PROFILE';
    isInfoPaneOpen: boolean;
    infoPaneType: 'CONTACT' | 'GROUP' | null;
    toggleSidebar: () => void;
    openModal: (modalName: string) => void;
    openProfile: (userId: string | number) => void;
    setInfoPane: (isOpen: boolean, type?: 'CONTACT' | 'GROUP' | null) => void;
    closeModal: () => void;
    setView: (view: 'CHATS' | 'STATUS' | 'CONTACTS' | 'NOTIFICATIONS' | 'PROFILE') => void;
}

export const useUIStore = create<UIState>((set) => ({
    isSidebarOpen: true,
    activeModal: null,
    viewingUserId: null,
    currentView: 'CHATS',
    isInfoPaneOpen: false,
    infoPaneType: null,
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    openModal: (modalName) => set({ activeModal: modalName }),
    openProfile: (userId) => set({ activeModal: 'USER_PROFILE', viewingUserId: userId }),
    setInfoPane: (isOpen, type = null) => set({ isInfoPaneOpen: isOpen, infoPaneType: type }),
    closeModal: () => set({ activeModal: null, viewingUserId: null }),
    setView: (view) => set({ currentView: view }),
}));
