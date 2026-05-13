import { useEffect, useCallback } from 'react';
import { notificationsApi } from '../api/notifications.api';
import { useNotificationStore } from '../store/notification.store';
import { useAuthStore } from '../store/auth.store';

export const useNotifications = () => {
    // Use granular selectors to get STABLE references — prevents infinite re-render loops
    const userId = useAuthStore((s) => s.user?.id);
    const notifications = useNotificationStore((s) => s.notifications);
    const unreadCount = useNotificationStore((s) => s.unreadCount);
    const setNotifications = useNotificationStore((s) => s.setNotifications);
    const markStoredAsRead = useNotificationStore((s) => s.markAsRead);
    const markAllStoredAsRead = useNotificationStore((s) => s.markAllAsRead);

    const fetchNotifications = useCallback(async () => {
        if (!userId) return;
        try {
            const response = await notificationsApi.getNotifications(userId);
            setNotifications(response);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    }, [userId, setNotifications]);

    const markAsRead = async (id: string | number) => {
        try {
            await notificationsApi.markAsRead(id);
            markStoredAsRead(id);
        } catch (error) {
            console.error('Failed to mark notification as read', error);
        }
    };

    const markAllAsRead = async () => {
        if (!userId) return;
        try {
            await notificationsApi.markAllAsRead(userId);
            markAllStoredAsRead();
        } catch (error) {
            console.error('Failed to mark all as read', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    return {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        refresh: fetchNotifications,
    };
};
