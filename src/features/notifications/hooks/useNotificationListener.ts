import { useEffect } from 'react';
import { socket } from '../../../socket';
import { useNotificationStore } from '../../../store/notification.store';
import type { Notification } from '../../../api/notifications.api';

export const useNotificationListener = () => {
    const { addNotification } = useNotificationStore();

    useEffect(() => {
        const handleNewNotification = (notification: Notification) => {
            addNotification(notification);
        };

        socket.on('notification:new', handleNewNotification);

        return () => {
            socket.off('notification:new', handleNewNotification);
        };
    }, [addNotification]);
};
