import React from 'react';
import { Bell } from 'lucide-react';
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
                    <Bell className="w-6 h-6" />
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
