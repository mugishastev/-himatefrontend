import React from 'react';
import type { User } from '../../../types/user.types';

interface UserAvatarProps {
    user: User;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    showStatus?: boolean;
    className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = 'md', showStatus = true, className = '' }) => {
    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-12 h-12 text-sm',
        lg: 'w-16 h-16 text-xl',
        xl: 'w-24 h-24 text-3xl',
        full: 'w-full h-full text-5xl',
    };

    const imageUrl = user.avatarUrl || user.profileImage;

    return (
        <div className={`relative ${size === 'full' ? 'w-full h-full' : 'inline-block'} ${className}`}>
            <div className={`${sizeClasses[size]} rounded-full bg-brand/10 border-2 border-white flex items-center justify-center font-bold text-brand overflow-hidden shadow-sm`}>
                {imageUrl ? (
                    <img src={imageUrl} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                    user.username.charAt(0).toUpperCase()
                )}
            </div>
            {showStatus && (
                <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            )}
        </div>
    );
};
