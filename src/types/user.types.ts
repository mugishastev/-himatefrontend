import type { BaseEntity } from './common.types';

export interface User extends BaseEntity {
    email: string;
    username: string;
    avatarUrl?: string;
    profileImage?: string;
    status?: string;
    lastSeen?: string;
    bio?: string;
    phoneNumber?: string;
    isVerified?: boolean;
    isAdmin?: boolean;
    role?: { id: number; name: string } | null;

    // Preferences / Settings
    theme?: string;
    showLastSeen?: boolean;
    showProfilePhoto?: boolean;
    readReceipts?: boolean;
    messageNotifs?: boolean;
    soundEnabled?: boolean;
    desktopNotifs?: boolean;
    twoStepEnabled?: boolean;
    enterToSend?: boolean;
    chatWallpaper?: string;
    wallpaperOpacity?: number;
}

export interface UpdateUserDto {
    email?: string;
    username?: string;
    avatarUrl?: string;
    profileImage?: string;
    status?: string;
    bio?: string;
    phoneNumber?: string;
    isVerified?: boolean;
    password?: string;
    
    // Preferences / Settings
    theme?: string;
    showLastSeen?: boolean;
    showProfilePhoto?: boolean;
    readReceipts?: boolean;
    messageNotifs?: boolean;
    soundEnabled?: boolean;
    desktopNotifs?: boolean;
    twoStepEnabled?: boolean;
    enterToSend?: boolean;
    chatWallpaper?: string;
    wallpaperOpacity?: number;
}
