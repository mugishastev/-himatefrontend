import api from './axios';

export const adminApi = {
    getStats: async () => {
        const response = await api.get('/admin/stats');
        return response.data;
    },
    getUsers: async (page = 1, limit = 20, search?: string) => {
        const response = await api.get('/admin/users', { params: { page, limit, search } });
        return response.data;
    },
    getConversations: async (page = 1, limit = 20) => {
        const response = await api.get('/admin/conversations', { params: { page, limit } });
        return response.data;
    },
    getMessages: async (page = 1, limit = 20) => {
        const response = await api.get('/admin/messages', { params: { page, limit } });
        return response.data;
    },
    banUser: async (userId: number, reason: string) => {
        const response = await api.post(`/admin/users/${userId}/ban`, { reason });
        return response.data;
    },
    unbanUser: async (userId: number) => {
        const response = await api.post(`/admin/users/${userId}/unban`);
        return response.data;
    },
};
