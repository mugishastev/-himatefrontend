import React from 'react';
import { useNotificationStore } from '../../../store/notification.store';

export const NotificationBadge: React.FC = () => {
    const { unreadCount } = useNotificationStore();

    if (unreadCount === 0) return null;

    return (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-in zoom-in duration-300">
            {unreadCount > 9 ? '9+' : unreadCount}
        </span>
    );
};
