import api from './axios';

export const contactsApi = {
    addContact: async (ownerId: number, contactId: number) => {
        const response = await api.post('/contacts', { ownerId, contactId });
        return response.data;
    },
    getUserContacts: async (userId: number, params?: any) => {
        const response = await api.get(`/contacts/user/${userId}`, { params });
        return response.data;
    },
    getContacts: async () => {
        const response = await api.get('/contacts');
        return response.data;
    },
    deleteContact: async (id: number) => {
        const response = await api.delete(`/contacts/${id}`);
        return response.data;
    },
};
