import api from './axios';

export const adminApi = {
    getStats: async () => {
        const response = await api.get('/admin/stats');
        return response.data;
    },
    getHealth: async () => {
        const response = await api.get('/admin/health');
        return response.data;
    },
    getUsers: async (page = 1, limit = 20, search?: string, isBanned?: boolean) => {
        const response = await api.get('/admin/users', { params: { page, limit, search, isBanned } });
        return response.data;
    },
    searchUsers: async (q: string, page = 1, limit = 20) => {
        const response = await api.get('/admin/users/search', { params: { q, page, limit } });
        return response.data;
    },
    getConversations: async (page = 1, limit = 20) => {
        const response = await api.get('/admin/conversations', { params: { page, limit } });
        return response.data;
    },
    searchConversations: async (q: string, page = 1, limit = 20) => {
        const response = await api.get('/admin/conversations/search', { params: { q, page, limit } });
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
    getAuditLogs: async (page = 1, limit = 30, action?: string) => {
        const response = await api.get('/admin/audit-logs', { params: { page, limit, action } });
        return response.data;
    },
    sendBroadcast: async (title: string, message: string) => {
        const response = await api.post('/admin/broadcast', { title, message });
        return response.data;
    },
    getBroadcastHistory: async () => {
        const response = await api.get('/admin/broadcast/history');
        return response.data;
    },
    getRoles: async (page = 1, limit = 50) => {
        const response = await api.get('/roles', { params: { page, limit } });
        return response.data;
    },
    createRole: async (name: string) => {
        const response = await api.post('/roles', { name });
        return response.data;
    },
    updateRole: async (id: number, name: string) => {
        const response = await api.patch(`/roles/${id}`, { name });
        return response.data;
    },
    deleteRole: async (id: number) => {
        const response = await api.delete(`/roles/${id}`);
        return response.data;
    },
    getPermissions: async (page = 1, limit = 200) => {
        const response = await api.get('/permissions', { params: { page, limit } });
        return response.data;
    },
    createPermission: async (roleId: number, action: string) => {
        const response = await api.post('/permissions', { roleId, action });
        return response.data;
    },
    deletePermission: async (id: number) => {
        const response = await api.delete(`/permissions/${id}`);
        return response.data;
    },
};

