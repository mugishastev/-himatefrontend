import { useEffect } from 'react';
import { socketService, setupSocketListeners } from '../socket';
import { useAuthStore } from '../store/auth.store';

export const useSocket = () => {
    const accessToken = useAuthStore((s) => s.accessToken);
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

    useEffect(() => {
        if (isAuthenticated && accessToken) {
            socketService.connect(accessToken);
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
