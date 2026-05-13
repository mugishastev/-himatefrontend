import React from 'react';
import { NotificationList } from '../components/NotificationList';

export const NotificationsPage: React.FC = () => {
    return (
        <div className="h-full flex flex-col bg-[#111b21]">
            <div className="p-6 border-b border-[#2a3942]">
                <h1 className="text-3xl font-extrabold text-[#e9edef] tracking-tight">Notifications</h1>
                <p className="text-[#8696a0] mt-1">Stay updated with your latest activities</p>
            </div>
            <div className="flex-1 overflow-y-auto">
                <NotificationList />
            </div>
        </div>
    );
};

export default NotificationsPage;
