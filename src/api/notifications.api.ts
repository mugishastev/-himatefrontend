import api from './axios';
import type { ApiResponse } from '../types/common.types';

export interface Notification {
    id: string;
    type: 'MESSAGE' | 'FRIEND_REQUEST' | 'SYSTEM';
    content: string;
    isRead: boolean;
    createdAt: string;
}

export const notificationsApi = {
    getNotifications: async (userId: number | string): Promise<ApiResponse<Notification[]>> => {
        const response = await api.get(`/notifications/user/${userId}`);
        return response.data;
    },
    markAsRead: async (id: string): Promise<ApiResponse<void>> => {
        const response = await api.patch(`/notifications/${id}`, { isRead: true });
        return response.data;
    },
    markAllAsRead: async (userId: number | string): Promise<ApiResponse<void>> => {
        const response = await api.patch(`/notifications/user/${userId}/read-all`);
        return response.data;
    },
};
