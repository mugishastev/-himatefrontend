export interface BaseEntity {
    id: string | number;
    createdAt: string;
    updatedAt: string;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
}

export type LoadingStatus = 'idle' | 'loading' | 'success' | 'error';
