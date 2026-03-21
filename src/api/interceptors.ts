// src/api/interceptors.ts
import type {
    AxiosError,
    AxiosInstance,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios';
import { handleApiError } from '../utils/error-handler';
import { useAuthStore } from '../store/auth.store';
import { tokenStorage } from '../utils/token';

interface AxiosRequestConfigWithRetry extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

interface ApiEnvelope<T = unknown> {
    success: boolean;
    message?: string;
    data: T;
}

const isApiEnvelope = (value: unknown): value is ApiEnvelope => {
    return (
        typeof value === 'object' &&
        value !== null &&
        'success' in value &&
        'data' in value
    );
};

export const setupInterceptors = (instance: AxiosInstance) => {
    instance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            const token = useAuthStore.getState().accessToken;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            // Let the browser/axios set multipart boundary automatically.
            if (config.data instanceof FormData) {
                delete config.headers['Content-Type'];
            }
            return config;
        },
        (error: AxiosError) => Promise.reject(error)
    );

    instance.interceptors.response.use(
        (response: AxiosResponse) => {
            if (isApiEnvelope(response.data)) {
                response.data = response.data.data;
            }
            return response;
        },
        async (error: AxiosError) => {
            const status = error.response?.status;
            const path = window.location.pathname;
            const config = error.config as AxiosRequestConfigWithRetry | undefined;

            if (status === 401 && config && !config._retry) {
                config._retry = true;

                const refreshToken = tokenStorage.getRefreshToken();
                if (refreshToken) {
                    try {
                        const { data } = await instance.post('/auth/refresh', { refreshToken });

                        const newAccessToken = data.accessToken;
                        tokenStorage.setToken(newAccessToken);
                        useAuthStore.getState().setAuth(
                            useAuthStore.getState().user!,
                            newAccessToken,
                            refreshToken
                        );

                        config.headers.Authorization = `Bearer ${newAccessToken}`;
                        return instance(config);
                    } catch (refreshError) {
                        useAuthStore.getState().logout();
                        window.location.replace('/login');
                        return Promise.reject(refreshError);
                    }
                } else {
                    useAuthStore.getState().logout();
                    window.location.replace('/login');
                }
            } else if (status === 401) {
                useAuthStore.getState().logout();
                if (!['/login', '/register', '/', '/verify-email', '/forgot-password', '/reset-password'].includes(path)) {
                    window.location.replace('/login');
                }
            } else {
                handleApiError(error);
            }

            return Promise.reject(error);
        }
    );
};
