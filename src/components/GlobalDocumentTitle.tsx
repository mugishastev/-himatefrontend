import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const TITLE_MAP: Record<string, string> = {
    '/': 'Welcome',
    '/login': 'Login',
    '/register': 'Create Account',
    '/forgot-password': 'Forgot Password',
    '/reset-password': 'Reset Password',
    '/verify-email': 'Verify Email',
    '/dashboard': 'Dashboard',
    '/contacts': 'Contacts',
    '/calls': 'Calls',
    '/settings': 'Settings',
    '/profile': 'Profile',
    '/notifications': 'Notifications',
    '/admin': 'Admin Overview',
    '/admin/users': 'Manage Users',
    '/admin/conversations': 'Manage Conversations',
    '/admin/messages': 'Manage Messages',
    '/admin/reports': 'User Reports',
    '/admin/banned': 'Banned Users',
    '/admin/tickets': 'Support Tickets',
    '/admin/announcements': 'Announcements',
    '/admin/media': 'Media Gallery',
    '/admin/settings': 'Admin Settings',
    '/admin/roles': 'Manage Roles',
    '/privacy': 'Privacy Policy',
    '/support': 'Support & FAQ',
    '/guide': 'User Guide',
};

export const GlobalDocumentTitle = () => {
    const location = useLocation();

    useEffect(() => {
        // If it's the dashboard, ChatWindow handles its own specific chat title
        // We only set the global title if it's NOT the dashboard, OR if it's explicitly the /dashboard route 
        // without an active chat (though ChatWindow handles that too, it's safer to let ChatWindow override).
        
        let customTitle = '';

        // Find exact match or partial match
        if (TITLE_MAP[location.pathname]) {
            customTitle = TITLE_MAP[location.pathname];
        } else {
            // Check for dynamic routes like /profile/:id
            if (location.pathname.startsWith('/profile/')) {
                customTitle = 'User Profile';
            }
        }

        if (customTitle && location.pathname !== '/dashboard') {
            document.title = `Himate | ${customTitle}`;
        }
    }, [location]);

    return null;
};
