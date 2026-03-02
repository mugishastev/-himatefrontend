import React from 'react';
import type { Notification } from '../../../api/notifications.api';
import { notificationsApi } from '../../../api/notifications.api';
import { useNotificationStore } from '../../../store/notification.store';

interface NotificationItemProps {
    notification: Notification;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
    const { markAsRead } = useNotificationStore();

    const handleRead = async () => {
        if (notification.isRead) return;
        try {
            await notificationsApi.markAsRead(notification.id);
            markAsRead(notification.id);
        } catch (error) {
            console.error('Failed to mark notification as read', error);
        }
    };

    return (
        <div
            onClick={handleRead}
            className={`p-4 cursor-pointer transition-colors duration-200 border-l-2 ${notification.isRead ? 'bg-white border-transparent' : 'bg-brand/5 border-brand'
                } hover:bg-bg-secondary`}
        >
            <div className="flex space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${notification.type === 'MESSAGE' ? 'bg-blue-100 text-blue-600' :
                        notification.type === 'FRIEND_REQUEST' ? 'bg-brand/10 text-brand' :
                            'bg-gray-100 text-gray-600'
                    }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {notification.type === 'MESSAGE' ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        )}
                    </svg>
                </div>
                <div className="flex-1 min-w-0">
                    <p className={`text-sm ${notification.isRead ? 'text-text-secondary' : 'text-text-primary font-medium'}`}>
                        {notification.content}
                    </p>
                    <span className="text-[10px] text-text-secondary mt-1 block">
                        {new Date(notification.createdAt).toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
    );
};
