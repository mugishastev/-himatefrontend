import api from './axios';

export const messagesApi = {
    sendMessage: async (data: any) => {
        const response = await api.post('/messages', data);
        return response.data;
    },
    getMessages: async (conversationId: string | number, params?: any) => {
        const response = await api.get(`/messages/conversation/${conversationId}`, { params });
        return response.data;
    },
    markAsRead: async (messageId: number) => {
        const response = await api.patch(`/messages/${messageId}/read`);
        return response.data;
    },
    deleteMessage: async (messageId: number) => {
        const response = await api.delete(`/messages/${messageId}`);
        return response.data;
    },
};
