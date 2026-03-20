import { create } from 'zustand';

export type ModalType =
    | 'NEW_CONVERSATION'
    | 'CREATE_GROUP'
    | 'ADD_CONTACT'
    | 'USER_PROFILE'
    | 'IMAGE_VIEWER'
    | 'START_CALL'
    | 'DIALPAD'
    | 'SCHEDULE_CALL'
    | 'CREATE_PAGE'
    | null;

interface UIState {
    isSidebarOpen: boolean;
    activeModal: ModalType;
    viewingUserId: string | number | null;
    viewingImageUrl: string | null;
    currentView: 'CHATS' | 'CALLS' | 'STATUS' | 'CONTACTS' | 'NOTIFICATIONS' | 'PROFILE' | 'SETTINGS' | 'PAGES' | 'CREATOR_STUDIO' | 'PAGE_INBOX';
    viewingPageHandle: string | null;
    isInfoPaneOpen: boolean;
    infoPaneType: 'CONTACT' | 'GROUP' | null;
    toggleSidebar: () => void;
    openModal: (modalName: ModalType) => void;
    openProfile: (userId: string | number) => void;
    openImage: (url: string) => void;
    setInfoPane: (isOpen: boolean, type?: 'CONTACT' | 'GROUP' | null) => void;
    closeModal: () => void;
    setView: (view: 'CHATS' | 'CALLS' | 'STATUS' | 'CONTACTS' | 'NOTIFICATIONS' | 'PROFILE' | 'SETTINGS' | 'PAGES' | 'CREATOR_STUDIO' | 'PAGE_INBOX') => void;
    openPage: (handle: string | null) => void;
}


export const useUIStore = create<UIState>((set) => ({
    isSidebarOpen: true,
    activeModal: null,
    viewingUserId: null,
    viewingImageUrl: null,
    currentView: 'CHATS',
    isInfoPaneOpen: false,
    infoPaneType: null,
    viewingPageHandle: null,
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    openModal: (modalName) => set({ activeModal: modalName }),
    openProfile: (userId) => set({ activeModal: 'USER_PROFILE', viewingUserId: userId }),
    openImage: (url) => set({ activeModal: 'IMAGE_VIEWER', viewingImageUrl: url }),
    setInfoPane: (isOpen, type = null) => set({ isInfoPaneOpen: isOpen, infoPaneType: type }),
    closeModal: () => set({ activeModal: null, viewingUserId: null, viewingImageUrl: null }),
    setView: (view) => set({ currentView: view }),
    openPage: (handle) => set({ currentView: 'PAGES', viewingPageHandle: handle }),
}));
