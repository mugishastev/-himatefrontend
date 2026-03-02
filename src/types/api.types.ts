export interface PaginationParams {
    page?: number;
    limit?: number;
    search?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
