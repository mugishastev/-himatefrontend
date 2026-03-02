import React, { useState, useRef } from 'react';
import { useAuthStore } from '../../../store/auth.store';
import { UserAvatar } from '../components/UserAvatar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { usersApi } from '../../../api/users.api';

export const ProfileView: React.FC = () => {
    const { user, updateUser, logout } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        bio: user?.bio || '',
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!user) return null;

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const updatedUser = await usersApi.update(Number(user.id), formData);
            updateUser(updatedUser);
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update profile', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        try {
            const result = await usersApi.uploadProfileImage(Number(user.id), file);
            updateUser({ avatarUrl: result.profileImage });
        } catch (error) {
            console.error('Failed to upload avatar', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto bg-bg-secondary p-6">
            <div className="max-w-2xl mx-auto space-y-6">
                <header className="flex flex-col items-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative cursor-pointer group/avatar" onClick={handleAvatarClick}>
                        <UserAvatar user={user} size="xl" />
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                    <h2 className="mt-4 text-3xl font-black text-text-primary tracking-tight">{user.username}</h2>
                    <p className="text-text-secondary font-medium">{user.email}</p>
                    <div className="mt-6 flex gap-3">
                        {isEditing ? (
                            <>
                                <Button variant="primary" size="sm" onClick={handleSave} isLoading={isLoading}>Save Changes</Button>
                                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                            </>
                        ) : (
                            <>
                                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                                <Button variant="outline" size="sm" onClick={logout} className="text-red-500 hover:bg-red-50 border-red-100">Logout</Button>
                            </>
                        )}
                    </div>
                </header>

                <Card className="p-8 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="font-black text-xl text-text-primary tracking-tight">Personal Information</h3>
                        {!isEditing && (
                            <button onClick={() => setIsEditing(true)} className="text-brand font-bold text-sm hover:underline">
                                Edit
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-text-secondary uppercase tracking-widest">Username</label>
                            {isEditing ? (
                                <Input
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            ) : (
                                <p className="text-text-primary font-bold text-lg">{user.username}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-text-secondary uppercase tracking-widest">Email Address</label>
                            {isEditing ? (
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            ) : (
                                <p className="text-text-primary font-bold text-lg">{user.email}</p>
                            )}
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-black text-text-secondary uppercase tracking-widest">Bio</label>
                            {isEditing ? (
                                <textarea
                                    className="w-full p-4 bg-bg-secondary rounded-2xl border-none focus:ring-2 focus:ring-brand/20 outline-none transition-all resize-none h-32 text-text-primary"
                                    placeholder="Write something about yourself..."
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                />
                            ) : (
                                <p className="text-text-secondary font-medium leading-relaxed italic bg-bg-secondary/50 p-4 rounded-2xl border border-dashed border-gray-200">
                                    {user.bio || "No bio added yet. Tell us about yourself!"}
                                </p>
                            )}
                        </div>
                    </div>
                </Card>

                {!isEditing && (
                    <Card className="p-8 space-y-6 bg-brand text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                        <div className="relative z-10">
                            <h3 className="font-black text-xl tracking-tight">Account Statistics</h3>
                            <div className="grid grid-cols-3 gap-4 mt-6">
                                <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                                    <p className="text-2xl font-black">12</p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Chats</p>
                                </div>
                                <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                                    <p className="text-2xl font-black">48</p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Contacts</p>
                                </div>
                                <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                                    <p className="text-2xl font-black">1.2k</p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Messages</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};
