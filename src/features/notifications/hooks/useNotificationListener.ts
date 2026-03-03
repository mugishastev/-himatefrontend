import { useEffect } from 'react';
import { socketService } from '../../../socket';
import { useNotificationStore } from '../../../store/notification.store';
import type { Notification } from '../../../api/notifications.api';

export const useNotificationListener = () => {
    const { addNotification } = useNotificationStore();

    useEffect(() => {
        const handleNewNotification = (notification: Notification) => {
            addNotification(notification);
        };

        socketService.on('notification', handleNewNotification);

        return () => {
            socketService.off('notification', handleNewNotification);
        };
    }, [addNotification]);
};
