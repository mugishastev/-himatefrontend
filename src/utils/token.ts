// src/utils/token.ts

const TOKEN_KEY = 'himate_token';
const REFRESH_TOKEN_KEY = 'himate_refresh_token';

export const tokenStorage = {
    // Access token
    getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
    setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
    removeToken: () => localStorage.removeItem(TOKEN_KEY),

    // Refresh token
    getRefreshToken: (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY),
    setRefreshToken: (token: string) => localStorage.setItem(REFRESH_TOKEN_KEY, token),
    removeRefreshToken: () => localStorage.removeItem(REFRESH_TOKEN_KEY),

    // Clear all tokens
    clear: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    },
};