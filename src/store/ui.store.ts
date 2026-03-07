import { create } from 'zustand';

interface UIState {
    isSidebarOpen: boolean;
    activeModal: string | null;
    viewingUserId: string | number | null;
    viewingImageUrl: string | null;
    currentView: 'CHATS' | 'CALLS' | 'STATUS' | 'CONTACTS' | 'NOTIFICATIONS' | 'PROFILE' | 'SETTINGS';
    isInfoPaneOpen: boolean;
    infoPaneType: 'CONTACT' | 'GROUP' | null;
    toggleSidebar: () => void;
    openModal: (modalName: string) => void;
    openProfile: (userId: string | number) => void;
    openImage: (url: string) => void;
    setInfoPane: (isOpen: boolean, type?: 'CONTACT' | 'GROUP' | null) => void;
    closeModal: () => void;
    setView: (view: 'CHATS' | 'CALLS' | 'STATUS' | 'CONTACTS' | 'NOTIFICATIONS' | 'PROFILE' | 'SETTINGS') => void;
}

export const useUIStore = create<UIState>((set) => ({
    isSidebarOpen: true,
    activeModal: null,
    viewingUserId: null,
    viewingImageUrl: null,
    currentView: 'CHATS',
    isInfoPaneOpen: false,
    infoPaneType: null,
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    openModal: (modalName) => set({ activeModal: modalName }),
    openProfile: (userId) => set({ activeModal: 'USER_PROFILE', viewingUserId: userId }),
    openImage: (url) => set({ activeModal: 'IMAGE_VIEWER', viewingImageUrl: url }),
    setInfoPane: (isOpen, type = null) => set({ isInfoPaneOpen: isOpen, infoPaneType: type }),
    closeModal: () => set({ activeModal: null, viewingUserId: null, viewingImageUrl: null }),
    setView: (view) => set({ currentView: view }),
}));
