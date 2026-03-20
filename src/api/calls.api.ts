import api from './axios';

export const callsApi = {
    createCall: async (data: { callerId: number; receiverId: number; startedAt: string; type: 'AUDIO' | 'VIDEO' }) => {
        const response = await api.post('/calls', data);
        return response.data;
    },
    getCalls: async (userId?: number) => {
        const path = userId ? `/calls/user/${userId}` : '/calls';
        const response = await api.get(path);
        return response.data;
    },
    updateCall: async (id: number, data: { endedAt?: string }) => {
        const response = await api.patch(`/calls/${id}`, data);
        return response.data;
    },
    deleteCall: async (id: number) => {
        const response = await api.delete(`/calls/${id}`);
        return response.data;
    },
    scheduleCall: async (data: { callerId: number; receiverId: number; scheduledAt: string; type: 'AUDIO' | 'VIDEO' }) => {
        const response = await api.post('/calls/schedule', data);
        return response.data;
    },
};
