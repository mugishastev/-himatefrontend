import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError, AxiosInstance } from 'axios';
import { handleApiError } from '../utils/error-handler';
import { useAuthStore } from '../store/auth.store';

export const setupInterceptors = (instance: AxiosInstance) => {
    // Request Interceptor
    instance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            const token = useAuthStore.getState().accessToken;
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
                // console.debug('[Request] Attaching token to:', config.url);
            } else if (!token) {
                // console.warn('[Request] No token found for:', config.url);
            }
            return config;
        },
        (error: AxiosError) => Promise.reject(error)
    );

    // Response Interceptor
    instance.interceptors.response.use(
        (response: AxiosResponse) => response,
        async (error: AxiosError) => {
            const status = error.response?.status;
            const path = window.location.pathname;

            if (status === 401) {
                console.group('%c UNAUTHORIZED (401) ', 'background: #d32f2f; color: #fff; font-weight: bold; padding: 2px 4px;');
                console.error('URL:', error.config?.url);
                console.error('Status:', status);
                console.error('Response Data:', error.response?.data);
                console.groupEnd();

                // Only perform logout and redirect if NOT on public pages (prevent infinite loop)
                const isPublicPage = ['/login', '/register', '/'].includes(path);

                if (!isPublicPage) {
                    console.warn('[Interceptor] Not on a public page. Clearing auth state and redirecting...');
                    useAuthStore.getState().logout();

                    // Use window.location.href ONLY if we are sure we are not already on login
                    if (path !== '/login') {
                        // Using window.location.replace to prevent back-button loops
                        window.location.replace('/login');
                    }
                }
            } else {
                // For other errors, use our standard error handler
                handleApiError(error);
            }

            return Promise.reject(error);
        }
    );
};
