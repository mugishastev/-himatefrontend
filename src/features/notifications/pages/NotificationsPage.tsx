import React from 'react';
import { NotificationList } from '../components/NotificationList';

export const NotificationsPage: React.FC = () => {
    return (
        <div className="h-full flex flex-col bg-white">
            <div className="p-6 border-b border-gray-100">
                <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Notifications</h1>
                <p className="text-text-secondary mt-1">Stay updated with your latest activities</p>
            </div>
            <div className="flex-1 overflow-y-auto">
                <NotificationList />
            </div>
        </div>
    );
};

export default NotificationsPage;
