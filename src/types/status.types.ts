import type { User } from './user.types';

export interface StatusPost {
    id: number;
    userId: number;
    content: string;
    mediaUrl?: string | null;
    createdAt: string;
    expiresAt: string;
    user?: User;
}

export interface StatusListResponse {
    data: StatusPost[];
    total: number;
    page: number;
    limit: number;
}
