import api from './axios';
import type { StatusListResponse, StatusPost } from '../types/status.types';

export const statusesApi = {
    getStatuses: async (): Promise<StatusListResponse> => {
        const response = await api.get('/statuses');
        return response.data;
    },
    createStatus: async (payload: {
        userId: number;
        content: string;
        expiresAt: string;
        media?: File | null;
    }): Promise<StatusPost> => {
        const hasMedia = !!payload.media;
        const data = hasMedia ? (() => {
            const formData = new FormData();
            formData.append('userId', String(payload.userId));
            formData.append('content', payload.content);
            formData.append('expiresAt', payload.expiresAt);
            formData.append('media', payload.media as File);
            return formData;
        })() : {
            userId: payload.userId,
            content: payload.content,
            expiresAt: payload.expiresAt,
        };

        const response = await api.post('/statuses', data, { timeout: hasMedia ? 60000 : 15000 });
        return response.data;
    },
    getStatusById: async (id: number | string): Promise<StatusPost> => {
        const response = await api.get(`/statuses/${id}`);
        return response.data;
    },
    updateStatus: async (
        id: number | string,
        payload: { content?: string; mediaUrl?: string; expiresAt?: string }
    ): Promise<StatusPost> => {
        const response = await api.patch(`/statuses/${id}`, payload);
        return response.data;
    },
    deleteStatus: async (id: number | string): Promise<void> => {
        await api.delete(`/statuses/${id}`);
    },
};
