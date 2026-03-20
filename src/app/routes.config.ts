export const ROUTES = {
    HOME: '/',
    DASHBOARD: '/dashboard',
    ADMIN: '/admin',
    AUTH: {
        LOGIN: '/login',
        REGISTER: '/register',
        VERIFY_EMAIL: '/verify-email',
        FORGOT_PASSWORD: '/forgot-password',
        RESET_PASSWORD: '/reset-password',
    },
    USER: {
        PROFILE: '/profile/:id',
        SETTINGS: '/settings',
    },
    PROFILE: '/profile',
    CONTACTS: '/contacts',
    NOTIFICATIONS: '/notifications',
    PRIVACY: '/privacy',
    SUPPORT: '/support',
    GUIDE: '/guide',
} as const;
