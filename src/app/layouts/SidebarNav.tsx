import React from 'react';
import { useUIStore } from '../../store/ui.store';
import { useAuthStore } from '../../store/auth.store';

export const SidebarNav: React.FC = () => {
    const { currentView, setView } = useUIStore();
    const { logout } = useAuthStore();

    const navItems = [
        {
            id: 'CHATS', icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            ), label: 'Chats'
        },
        {
            id: 'CONTACTS', icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ), label: 'Contacts'
        },
        {
            id: 'PROFILE', icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ), label: 'Profile'
        }
    ];

    return (
        <div className="w-20 bg-brand flex flex-col items-center py-6 space-y-8 text-white/70">
            <div className="w-12 h-12 flex items-center justify-center mb-6">
                <img src="/logo.png" alt="Himate" className="w-full h-auto object-contain" />
            </div>

            <div className="flex-1 w-full space-y-4 px-2">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setView(item.id as any)}
                        className={`w-full py-3 flex flex-col items-center justify-center rounded-xl transition-all duration-200 ${currentView === item.id
                            ? 'bg-white/20 text-white shadow-lg'
                            : 'hover:bg-white/10 hover:text-white'
                            }`}
                        title={item.label}
                    >
                        {item.icon}
                        <span className="text-[10px] mt-1 font-medium">{item.label}</span>
                    </button>
                ))}
            </div>

            <button
                onClick={logout}
                className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/10 hover:text-white transition-colors"
                title="Logout"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
            </button>
        </div>
    );
};
