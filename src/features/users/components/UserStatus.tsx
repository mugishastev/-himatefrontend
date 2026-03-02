import React from 'react';

interface UserStatusProps {
    isOnline: boolean;
    lastSeen?: string;
    showLabel?: boolean;
}

export const UserStatus: React.FC<UserStatusProps> = ({ isOnline, lastSeen, showLabel = true }) => {
    return (
        <div className="flex items-center space-x-2">
            <span className={`w-2.5 h-2.5 rounded-full border-2 border-white ${isOnline ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-gray-300'}`}></span>
            {showLabel && (
                <span className="text-xs text-text-secondary font-medium">
                    {isOnline ? 'Online' : lastSeen ? `Last seen ${new Date(lastSeen).toLocaleDateString()}` : 'Offline'}
                </span>
            )}
        </div>
    );
};
