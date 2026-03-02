import type { User } from './user.types';

export type { User };

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}
