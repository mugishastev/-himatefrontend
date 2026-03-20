import api from './axios';

export const usersApi = {
    findAll: async (params?: any) => {
        const response = await api.get('/users', { params });
        return response.data;
    },
    getProfile: async (id: string | number) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },
    update: async (id: number, data: any) => {
        const response = await api.patch(`/users/${id}`, data);
        return response.data;
    },
    uploadProfileImage: async (id: number, file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        const response = await api.patch(`/users/${id}/profile-image`, formData, {
            timeout: 30000,
        });
        return response.data;
    },
    updateFcmToken: async (id: number, fcmToken: string) => {
        const response = await api.patch(`/users/${id}/fcm-token`, { fcmToken });
        return response.data;
    },
    changePassword: async (id: number, currentPassword: string, newPassword: string) => {
        const response = await api.patch(`/users/${id}/change-password`, { currentPassword, newPassword });
        return response.data;
    },
    deleteAccount: async (id: number) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    },
    blockUser: async (targetUserId: number) => {
        const response = await api.post(`/users/${targetUserId}/block`);
        return response.data;
    },
    unblockUser: async (targetUserId: number) => {
        const response = await api.delete(`/users/${targetUserId}/block`);
        return response.data;
    },
};
