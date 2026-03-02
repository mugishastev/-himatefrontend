import type { BaseEntity } from './common.types';

export interface User extends BaseEntity {
    email: string;
    username: string;
    avatarUrl?: string;
    status?: string;
    lastSeen?: string;
    bio?: string;
    isAdmin?: boolean;
}

export interface UpdateUserDto {
    username?: string;
    avatarUrl?: string;
    status?: string;
}
