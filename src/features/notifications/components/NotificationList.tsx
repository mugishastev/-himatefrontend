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
        <div className="w-full bg-[#111b21] rounded-2xl shadow-xl border border-[#2a3942] overflow-hidden">
            <div className="p-4 border-b border-[#2a3942] flex justify-between items-center">
                <h3 className="font-bold text-[#e9edef]">Notifications</h3>
                <button
                    onClick={() => markAllAsRead()}
                    className="text-xs text-[#F97316] hover:underline"
                >
                    Mark all as read
                </button>
            </div>
            <div className="max-h-96 overflow-y-auto divide-y divide-[#2a3942]">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-[#8696a0] text-sm">
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
