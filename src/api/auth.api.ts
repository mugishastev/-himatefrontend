import api from './axios';
import type { AuthResponse } from '../types/auth.types';

export const authApi = {
    login: async (data: any): Promise<AuthResponse> => {
        const response = await api.post('/auth/login', data);
        return response.data;
    },
    refreshToken: async (refreshTokenValue: string): Promise<AuthResponse> => {
        const response = await api.post('/auth/refresh', { refreshToken: refreshTokenValue });
        return response.data;
    },
    register: async (data: any): Promise<AuthResponse> => {
        const response = await api.post('/auth/register', data);
        return response.data;
    },
    logout: async (): Promise<void> => {
        await api.post('/auth/logout');
    },
    getMe: async (): Promise<AuthResponse> => {
        const response = await api.get('/auth/profile');
        return response.data;
    },
    verifyEmail: async (email: string, otp: string): Promise<AuthResponse> => {
        const response = await api.post('/auth/verify-email', { email, otp });
        return response.data;
    },
    resendOtp: async (email: string): Promise<void> => {
        await api.post('/auth/resend-otp', { email });
    },
    forgotPassword: async (email: string): Promise<void> => {
        await api.post('/auth/forgot-password', { email });
    },
    resetPassword: async (email: string, otp: string, newPassword: string): Promise<void> => {
        await api.post('/auth/reset-password', { email, otp, newPassword });
    },
};
