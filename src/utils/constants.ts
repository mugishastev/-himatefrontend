export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

export const APP_NAME = 'Himate';
export const APP_VERSION = '1.0.0';

export const LOCAL_STORAGE_KEYS = {
    TOKEN: 'himate_token',
    USER: 'himate_user',
    THEME: 'himate_theme',
};

export const PAGINATION = {
    DEFAULT_LIMIT: 20,
};
