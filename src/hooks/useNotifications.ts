import { useEffect, useCallback } from 'react';
import { notificationsApi } from '../api/notifications.api';
import { useNotificationStore } from '../store/notification.store';
import { useAuthStore } from '../store/auth.store';

export const useNotifications = () => {
    const { user } = useAuthStore();
    const {
        notifications,
        unreadCount,
        setNotifications,
        markAsRead: markStoredAsRead,
        markAllAsRead: markAllStoredAsRead
    } = useNotificationStore();

    const fetchNotifications = useCallback(async () => {
        if (!user?.id) return;
        try {
            const response = await notificationsApi.getNotifications(user.id);
            setNotifications(response);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    }, [setNotifications, user?.id]);

    const markAsRead = async (id: string | number) => {
        try {
            await notificationsApi.markAsRead(id);
            markStoredAsRead(id);
        } catch (error) {
            console.error('Failed to mark notification as read', error);
        }
    };

    const markAllAsRead = async () => {
        if (!user?.id) return;
        try {
            await notificationsApi.markAllAsRead(user.id);
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
