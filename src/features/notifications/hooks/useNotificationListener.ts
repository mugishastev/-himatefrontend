import { useEffect } from 'react';
import { socketService } from '../../../socket';
import { useNotificationStore } from '../../../store/notification.store';
import type { Notification } from '../../../api/notifications.api';

export const useNotificationListener = () => {
    const addNotification = useNotificationStore((s) => s.addNotification);

    useEffect(() => {
        const handleNewNotification = (notification: Notification) => {
            addNotification(notification);
        };

        socketService.on('notification', handleNewNotification);

        return () => {
            socketService.off('notification', handleNewNotification);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};
