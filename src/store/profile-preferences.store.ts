import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeColor = 'orange' | 'blue' | 'emerald';
type Visibility = 'everyone' | 'contacts' | 'nobody';
type NotificationSound = 'default' | 'soft' | 'none';

interface ProfilePreferencesState {
    darkMode: boolean;
    themeColor: ThemeColor;
    showEmail: boolean;
    showPhone: boolean;
    showLastSeen: boolean;
    profileVisibility: Visibility;
    statusVisibility: Visibility;
    endToEndEncryption: boolean;
    blockedUsers: string[];
    mutedChats: string[];
    notificationSound: NotificationSound;
    toggleDarkMode: () => void;
    setThemeColor: (value: ThemeColor) => void;
    setShowEmail: (value: boolean) => void;
    setShowPhone: (value: boolean) => void;
    setShowLastSeen: (value: boolean) => void;
    setProfileVisibility: (value: Visibility) => void;
    setStatusVisibility: (value: Visibility) => void;
    setEndToEndEncryption: (value: boolean) => void;
    addBlockedUser: (value: string) => void;
    removeBlockedUser: (value: string) => void;
    toggleMutedChat: (conversationId: string | number) => void;
    setNotificationSound: (value: NotificationSound) => void;
}

export const useProfilePreferencesStore = create<ProfilePreferencesState>()(
    persist(
        (set, get) => ({
            darkMode: false,
            themeColor: 'orange',
            showEmail: true,
            showPhone: false,
            showLastSeen: true,
            profileVisibility: 'everyone',
            statusVisibility: 'contacts',
            endToEndEncryption: true,
            blockedUsers: [],
            mutedChats: [],
            notificationSound: 'default',
            toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
            setThemeColor: (value) => set({ themeColor: value }),
            setShowEmail: (value) => set({ showEmail: value }),
            setShowPhone: (value) => set({ showPhone: value }),
            setShowLastSeen: (value) => set({ showLastSeen: value }),
            setProfileVisibility: (value) => set({ profileVisibility: value }),
            setStatusVisibility: (value) => set({ statusVisibility: value }),
            setEndToEndEncryption: (value) => set({ endToEndEncryption: value }),
            addBlockedUser: (value) =>
                set((state) => {
                    const normalized = value.trim().toLowerCase();
                    if (!normalized || state.blockedUsers.includes(normalized)) return state;
                    return { blockedUsers: [...state.blockedUsers, normalized] };
                }),
            removeBlockedUser: (value) =>
                set((state) => ({ blockedUsers: state.blockedUsers.filter((u) => u !== value) })),
            toggleMutedChat: (conversationId) =>
                set((state) => {
                    const id = String(conversationId);
                    return state.mutedChats.includes(id)
                        ? { mutedChats: state.mutedChats.filter((chatId) => chatId !== id) }
                        : { mutedChats: [...state.mutedChats, id] };
                }),
            setNotificationSound: (value) => set({ notificationSound: value }),
        }),
        {
            name: 'himate-profile-preferences',
        }
    )
);

export const getThemeTokens = (theme: ThemeColor, darkMode: boolean) => {
    const brandMap = {
        orange: {
            primary: '#FF6B22',
            secondary: '#FF8A50',
            dark: '#E65100',
            light: '#FFF1EA',
        },
        blue: {
            primary: '#2563EB',
            secondary: '#60A5FA',
            dark: '#1D4ED8',
            light: '#EAF2FF',
        },
        emerald: {
            primary: '#059669',
            secondary: '#34D399',
            dark: '#047857',
            light: '#E8FFF7',
        },
    } as const;

    const selected = brandMap[theme];

    return {
        '--brand-primary': selected.primary,
        '--brand-secondary': selected.secondary,
        '--brand-dark': selected.dark,
        '--brand-light': selected.light,
        '--bg-primary': darkMode ? '#0B1220' : '#FFFFFF',
        '--bg-secondary': darkMode ? '#111A2D' : '#F9FAFB',
        '--text-primary': darkMode ? '#F3F4F6' : '#111827',
        '--text-secondary': darkMode ? '#D1D5DB' : '#4B5563',
        '--text-muted': darkMode ? '#9CA3AF' : '#9CA3AF',
    } as const;
};
