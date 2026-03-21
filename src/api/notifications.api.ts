import api from './axios';

export interface Notification {
    id: string | number;
    type: 'MESSAGE' | 'FRIEND_REQUEST' | 'SYSTEM';
    content: string;
    isRead: boolean;
    createdAt: string;
}

export const notificationsApi = {
    getNotifications: async (userId: number | string): Promise<Notification[]> => {
        const response = await api.get(`/notifications/user/${userId}`);
        return response.data?.data || response.data;
    },
    markAsRead: async (id: string | number): Promise<void> => {
        const response = await api.patch(`/notifications/${id}`, { isRead: true });
        return response.data;
    },
    markAllAsRead: async (userId: number | string): Promise<void> => {
        const response = await api.patch(`/notifications/user/${userId}/read-all`);
        return response.data;
    },
};
