import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError, AxiosInstance } from 'axios';
import { handleApiError } from '../utils/error-handler';
import { tokenStorage } from '../utils/token';
import { useAuthStore } from '../store/auth.store';

export const setupInterceptors = (instance: AxiosInstance) => {
    // Request Interceptor
    instance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            const token = tokenStorage.getToken();
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error: AxiosError) => {
            return Promise.reject(error);
        }
    );

    // Response Interceptor
    instance.interceptors.response.use(
        (response: AxiosResponse) => {
            return response;
        },
        (error: AxiosError) => {
            if (error.response?.status === 401) {
                // Clear state through the store
                useAuthStore.getState().logout();

                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            } else {
                handleApiError(error);
            }
            return Promise.reject(error);
        }
    );
};
