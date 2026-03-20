import api from './axios';

export const conversationsApi = {
    createConversation: async (data: { userIds: number[]; title?: string; isGroup?: boolean }) => {
        const response = await api.post('/conversations', data);
        return response.data;
    },
    getConversations: async (userId?: number) => {
        // If userId is not provided, we might need to get it from the store or 
        // rely on the backend to identify the user from the JWT token.
        // My previous research showed GET /conversations/user/:userId.
        const path = userId ? `/conversations/user/${userId}` : '/conversations';
        const response = await api.get(path);
        return response.data;
    },
    getConversationDetails: async (id: number) => {
        const response = await api.get(`/conversations/${id}`);
        return response.data;
    },
    addParticipant: async (conversationId: number, userId: number) => {
        const response = await api.post(`/conversations/${conversationId}/participants`, { userId });
        return response.data;
    },
    removeParticipant: async (conversationId: number, userId: number) => {
        const response = await api.delete(`/conversations/${conversationId}/participants/${userId}`);
        return response.data;
    },
    deleteConversation: async (conversationId: number) => {
        const response = await api.delete(`/conversations/${conversationId}`);
        return response.data;
    },
};
