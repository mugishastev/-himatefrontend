import React, { useEffect } from 'react';
import { useNotificationStore } from '../../../store/notification.store';
import { NotificationItem } from './NotificationItem';
import { notificationsApi } from '../../../api/notifications.api';
import { useAuthStore } from '../../../store/auth.store';

export const NotificationList: React.FC = () => {
    const { notifications, setNotifications, markAllAsRead } = useNotificationStore();
    const { user } = useAuthStore();

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!user?.id) return;
            try {
                const response = await notificationsApi.getNotifications(user.id);
                setNotifications(response);
            } catch (error) {
                console.error('Failed to fetch notifications', error);
            }
        };
        fetchNotifications();
    }, [setNotifications, user?.id]);

    return (
        <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-text-primary">Notifications</h3>
                <button
                    onClick={() => markAllAsRead()}
                    className="text-xs text-brand hover:underline"
                >
                    Mark all as read
                </button>
            </div>
            <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-text-secondary text-sm">
                        No new notifications
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <NotificationItem key={notification.id} notification={notification} />
                    ))
                )}
            </div>
        </div>
    );
};
