import { AxiosError } from 'axios';
import { useToastStore } from '../store/toast.store';

export const extractErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
        return error.response?.data?.message || error.message || 'An unexpected error occurred';
    }
    if (error instanceof Error) {
        return error.message;
    }
    return 'An unknown error occurred';
};

export const handleApiError = (error: unknown) => {
    const message = extractErrorMessage(error);
    useToastStore.getState().addToast(message, 'error');
    console.error('API Error:', message);
    return message;
};
