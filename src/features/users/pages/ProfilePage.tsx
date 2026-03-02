import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usersApi } from '../../../api/users.api';
import type { User } from '../../../types/user.types';
import { UserAvatar } from '../components/UserAvatar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export const ProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!id) return;
            try {
                const response = await usersApi.getProfile(id);
                setUser(response.data);
            } catch (error) {
                console.error('Failed to fetch profile', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    if (isLoading) return <div className="p-8 text-center">Loading profile...</div>;
    if (!user) return <div className="p-8 text-center text-error">User not found</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="relative h-48 bg-gradient-to-r from-brand to-brand-secondary rounded-3xl shadow-lg overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="absolute -bottom-16 left-8 p-1 bg-white rounded-full shadow-xl">
                    <UserAvatar user={user} size="xl" showStatus={false} />
                </div>
            </header>

            <div className="pt-16 px-8 flex justify-between items-start">
                <div>
                    <h1 className="text-4xl font-extrabold text-text-primary tracking-tight">
                        {user.username}
                    </h1>
                    <p className="text-text-secondary text-lg mt-1">{user.email}</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline">Edit Profile</Button>
                    <Button variant="primary">Message</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
                <Card className="p-6 md:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold text-text-primary">About</h2>
                    <p className="text-text-secondary leading-relaxed">
                        {user.bio || "This user hasn't added a bio yet."}
                    </p>
                </Card>
                <Card className="p-6 space-y-4">
                    <h2 className="text-xl font-bold text-text-primary">Details</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-text-secondary">Joined</span>
                            <span className="text-text-primary font-medium">
                                {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-text-secondary">Status</span>
                            <span className="text-green-500 font-bold uppercase tracking-wide">
                                Active
                            </span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ProfilePage;
