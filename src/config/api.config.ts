import { env } from './env';

export const apiConfig = {
    baseURL: env.apiUrl,
    timeout: 10000,
};
