import { useState, useEffect, useCallback } from 'react';
import { usersApi } from '../../../api/users.api';
import type { User } from '../../../types/user.types';

export const useUserProfile = (userId: string | undefined) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        if (!userId) return;
        setIsLoading(true);
        setError(null);
        try {
            const response = await usersApi.getProfile(userId);
            setUser(response.data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch user profile');
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return { user, isLoading, error, refresh: fetchProfile };
};
