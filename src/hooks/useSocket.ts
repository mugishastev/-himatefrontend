import { useEffect } from 'react';
import { socketService, setupSocketListeners } from '../socket';
import { useAuthStore } from '../store/auth.store';

export const useSocket = () => {
    const { accessToken, isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (isAuthenticated && accessToken) {
            socketService.connect();
            setupSocketListeners();
        } else {
            socketService.disconnect();
        }

        return () => {
            socketService.disconnect();
        };
    }, [isAuthenticated, accessToken]);

    return socketService.getSocket();
};
