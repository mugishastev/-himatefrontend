import React from 'react';
import { useUIStore } from '../../store/ui.store';
import { useAuthStore } from '../../store/auth.store';
import { useConversationStore } from '../../store/conversation.store';
import { useNotificationStore } from '../../store/notification.store';
import { UserAvatar } from '../../features/users/components/UserAvatar';

export const SidebarNav: React.FC = () => {
    const { currentView, setView } = useUIStore();
    const { logout, user } = useAuthStore();
    const { conversations } = useConversationStore();
    const { unreadCount } = useNotificationStore();

    const chatUnread = conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);

    const topItems = [
        {
            id: 'CHATS',
            activeIcon: (
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 2.22.73 4.28 1.95 5.92L2.5 22l4.28-1.39C8.32 21.5 10.11 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm-2 13H8v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z" />
                </svg>
            ),
            inactiveIcon: (
                <svg className="w-6 h-6 text-[#aebac1] group-hover:text-[#d1d7db]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            ),
            label: 'Chats',
            badge: chatUnread
        },
        {
            id: 'CALLS',
            activeIcon: (
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.03 21c.75 0 .99-.65.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
                </svg>
            ),
            inactiveIcon: (
                <svg className="w-6 h-6 text-[#aebac1] group-hover:text-[#d1d7db]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
            ),
            label: 'Calls'
        },
        {
            id: 'STATUS',
            activeIcon: (
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
                </svg>
            ),
            inactiveIcon: (
                <svg className="w-6 h-6 text-[#aebac1] group-hover:text-[#d1d7db]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" strokeWidth="1.8" strokeDasharray="3 1.5" />
                    <circle cx="12" cy="12" r="4" strokeWidth="0" fill="currentColor" />
                </svg>
            ),
            label: 'Status'
        },
        {
            id: 'CONTACTS',
            activeIcon: (
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
            ),
            inactiveIcon: (
                <svg className="w-6 h-6 text-[#aebac1] group-hover:text-[#d1d7db]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            label: 'Contacts'
        }
    ];

    const bottomItems = [
        {
            id: 'NOTIFICATIONS',
            activeIcon: (
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                </svg>
            ),
            inactiveIcon: (
                <svg className="w-6 h-6 text-[#aebac1] group-hover:text-[#d1d7db]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0m6 0H9" />
                </svg>
            ),
            label: 'Alerts',
            badge: unreadCount
        },
        {
            id: 'SETTINGS',
            activeIcon: (
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.06-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.73 8.87a.49.49 0 00.12.61l2.03 1.58c-.05.3-.09.62-.09.94s.02.64.06.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .43-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.49-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                </svg>
            ),
            inactiveIcon: (
                <svg className="w-6 h-6 text-[#aebac1] group-hover:text-[#d1d7db]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            label: 'Settings'
        }
    ];

    return (
        <div className="w-[60px] lg:w-[64px] bg-[#202c33] flex flex-col items-center py-4 h-full border-r border-[#313d45] shrink-0 z-20">
            {/* Logo */}
            <div className="w-10 h-10 flex items-center justify-center mb-4 shrink-0 cursor-pointer hover:opacity-80 transition-opacity" title="Himate">
                <img src="/logo.png" alt="Himate" className="w-8 h-8 object-contain brightness-0 invert opacity-90" />
            </div>

            {/* Top Container */}
            <div className="w-full flex flex-col gap-3 items-center">
                {topItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setView(item.id as any)}
                        className="group flex flex-col items-center justify-center relative w-12 h-12"
                        title={item.label}
                    >
                        <span className={`flex items-center justify-center rounded-full w-10 h-10 transition-colors ${currentView === item.id ? 'bg-[#374248]' : 'bg-transparent'}`}>
                            {currentView === item.id ? item.activeIcon : item.inactiveIcon}
                        </span>
                        {!!item.badge && (
                            <span className="absolute top-0 right-0 min-w-[18px] h-[18px] px-1 rounded-full bg-[#00a884] text-[#111b21] text-[10px] font-bold flex items-center justify-center shadow-[0_0_0_2px_#202c33]">
                                {item.badge > 9 ? '9+' : item.badge}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Bottom Container */}
            <div className="w-full flex-1 flex flex-col gap-3 items-center justify-end pb-2">
                {bottomItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setView(item.id as any)}
                        className="group flex flex-col items-center justify-center relative w-12 h-12"
                        title={item.label}
                    >
                        <span className={`flex items-center justify-center rounded-full w-10 h-10 transition-colors ${currentView === item.id ? 'bg-[#374248]' : 'bg-transparent'}`}>
                            {currentView === item.id ? item.activeIcon : item.inactiveIcon}
                        </span>
                        {!!item.badge && (
                            <span className="absolute top-1 right-1 w-[10px] h-[10px] rounded-full bg-[#00a884] shadow-[0_0_0_2px_#202c33]"></span>
                        )}
                    </button>
                ))}

                <div className="w-8 h-[1px] bg-[#313d45] my-1" />

                <button
                    onClick={() => setView('PROFILE')}
                    className="group flex items-center justify-center w-12 h-12 relative"
                    title="Profile"
                >
                    <div className={`w-8 h-8 rounded-full overflow-hidden transition-all duration-200 ${currentView === 'PROFILE' ? 'ring-[2px] ring-[#00a884] ring-offset-[#202c33] ring-offset-[2px]' : 'group-hover:opacity-80'}`}>
                        {user ? (
                            <UserAvatar user={user} size="sm" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-[#374248]" />
                        )}
                    </div>
                </button>
            </div>
        </div>
    );
};
