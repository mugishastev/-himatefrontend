import React from 'react';

interface UserStatusProps {
    isOnline: boolean;
    lastSeen?: string;
    showLabel?: boolean;
}

export const UserStatus: React.FC<UserStatusProps> = ({ isOnline, lastSeen, showLabel = true }) => {
    return (
        <div className="flex items-center space-x-2">
            <span className={`w-2.5 h-2.5 rounded-full border-2 border-[#202c33] ${isOnline ? 'bg-[#F97316] shadow-[0_0_8px_rgba(249,115,22,0.5)]' : 'bg-[#8696a0]'}`}></span>
            {showLabel && (
                <span className="text-xs text-text-secondary font-medium">
                    {isOnline ? 'Online' : lastSeen ? `Last seen ${new Date(lastSeen).toLocaleDateString()}` : 'Offline'}
                </span>
            )}
        </div>
    );
};
