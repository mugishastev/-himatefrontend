import React from 'react';
import { useAuthStore } from '../../store/auth.store';
import { UserAvatar } from '../../features/users/components/UserAvatar';
import { NotificationBadge } from '../../features/notifications/components/NotificationBadge';

export const Header: React.FC = () => {
    const { user } = useAuthStore();

    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-30">
            <div>
                <h2 className="text-xl font-bold text-text-primary">Dashboard</h2>
            </div>
            <div className="flex items-center space-x-6">
                <button className="relative p-2 text-text-secondary hover:text-brand transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <NotificationBadge />
                </button>
                <div className="h-8 w-px bg-gray-100"></div>
                <div className="flex items-center space-x-3 group cursor-pointer">
                    <div className="text-right">
                        <p className="text-sm font-bold text-text-primary group-hover:text-brand transition-colors">{user?.username}</p>
                        <p className="text-[10px] text-text-muted font-bold tracking-wider">ONLINE</p>
                    </div>
                    {user && <UserAvatar user={user} size="sm" />}
                </div>
            </div>
        </header>
    );
};
