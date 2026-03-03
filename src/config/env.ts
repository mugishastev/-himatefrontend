console.log('Current API URL:', import.meta.env.VITE_API_URL || 'http://localhost:5000/api');
export const env = {
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    socketUrl: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
    appName: import.meta.env.VITE_APP_NAME || 'Himate',
    isDev: import.meta.env.VITE_APP_ENV === 'development',
    isProd: import.meta.env.VITE_APP_ENV === 'production',
} as const;
