import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { UserAvatar } from './UserAvatar';
import { usersApi } from '../../../api/users.api';
import type { User } from '../../../types/user.types';
import { formatRelativeTime } from '../../../utils/date';
import { useUserStore } from '../../../store/user.store';

interface UserProfileModalProps {
    userId: string | number;
    onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ userId, onClose }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { onlineUsers } = useUserStore();

    useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(true);
            try {
                const response = await usersApi.getProfile(userId);
                setUser(response.data || response);
            } catch (error) {
                console.error('Failed to fetch user profile:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, [userId]);

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <Card className="w-full max-w-md p-8 text-center bg-white border-none shadow-2xl">
                    <div className="animate-spin w-10 h-10 border-4 border-brand border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-text-secondary font-bold">Loading profile...</p>
                </Card>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <Card className="w-full max-w-md p-6 bg-white border-none shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-black text-text-primary tracking-tight">Error</h2>
                        <button onClick={onClose} className="p-2 hover:bg-bg-secondary rounded-full transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <p className="text-center text-text-secondary py-8">User not found or something went wrong.</p>
                    <Button onClick={onClose} variant="outline" className="w-full font-bold">Close</Button>
                </Card>
            </div>
        );
    }

    const isOnline = onlineUsers.includes(String(user.id));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <Card className="w-full max-w-md p-0 overflow-hidden bg-white border-none shadow-2xl rounded-3xl">
                {/* Header Background */}
                <div className="h-32 bg-gradient-to-br from-brand to-brand/70" />

                <div className="px-6 pb-6 relative">
                    {/* Avatar overlap */}
                    <div className="absolute -top-12 left-6">
                        <div className="p-1 bg-white rounded-full shadow-lg">
                            <UserAvatar user={user} size="xl" className="w-24 h-24" />
                        </div>
                    </div>

                    <div className="absolute top-4 right-4">
                        <button onClick={onClose} className="p-2 bg-black/20 hover:bg-black/30 text-white rounded-full transition-colors backdrop-blur-md">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="pt-16 space-y-6">
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-2xl font-black text-text-primary tracking-tight">{user.username}</h2>
                                {isOnline && <span className="w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>}
                            </div>
                            <p className="text-sm font-medium text-text-secondary bg-bg-secondary inline-block px-3 py-1 rounded-full mt-2">
                                {user.email}
                            </p>
                        </div>

                        {user.bio && (
                            <div className="space-y-1">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-text-muted">About</h3>
                                <p className="text-sm text-text-secondary leading-relaxed font-semibold">{user.bio}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-bg-secondary rounded-2xl">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Status</h3>
                                <p className="text-xs font-bold text-text-primary truncate">
                                    {isOnline ? 'Active Now' : user.lastSeen ? `Seen ${formatRelativeTime(user.lastSeen)}` : 'Offline'}
                                </p>
                            </div>
                            {user.phoneNumber && (
                                <div className="p-3 bg-bg-secondary rounded-2xl">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Phone</h3>
                                    <p className="text-xs font-bold text-text-primary truncate">{user.phoneNumber}</p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button className="flex-1 rounded-2xl font-black tracking-wide" variant="primary" onClick={onClose}>
                                Message
                            </Button>
                            <Button className="rounded-2xl px-4" variant="outline">
                                <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                </svg>
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};
