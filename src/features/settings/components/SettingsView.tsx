import React from 'react';
import { useUIStore } from '../../../store/ui.store';
import { useAuthStore } from '../../../store/auth.store';
import { UserAvatar } from '../../users/components/UserAvatar';

export const SettingsView: React.FC = () => {
    const { setView } = useUIStore();
    const { user } = useAuthStore();

    if (!user) return null;

    return (
        <div className="flex flex-col h-full bg-[#f0f2f5] animate-in fade-in duration-300">
            {/* Header */}
            <header className="h-[108px] bg-brand flex items-end px-8 pb-4 shrink-0 text-white shadow-md z-10">
                <button
                    onClick={() => setView('CHATS')}
                    className="mr-6 hover:bg-white/20 p-2 rounded-full transition-colors flex items-center gap-2"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="font-medium text-[16px]">Back</span>
                </button>
                <h1 className="text-[22px] font-semibold tracking-wide ml-4">Settings</h1>
            </header>

            <div className="flex-1 overflow-y-auto no-scrollbar py-10 px-4 md:px-8">
                <div className="max-w-4xl mx-auto space-y-6">

                    {/* Profile Card */}
                    <div
                        className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-6 cursor-pointer hover:bg-brand/5 border border-transparent hover:border-brand/20 transition-all duration-300 group"
                        onClick={() => setView('PROFILE')}
                    >
                        <div className="w-[100px] h-[100px] rounded-full overflow-hidden shrink-0 shadow-md ring-2 ring-white">
                            <UserAvatar user={user} size="full" />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <h2 className="text-2xl font-bold text-[#111b21] leading-tight truncate group-hover:text-brand transition-colors">
                                {user.username}
                            </h2>
                            <p className="text-[15px] text-[#667781] truncate mt-1">
                                {user.bio || 'Available'}
                            </p>
                        </div>
                        <div className="text-brand opacity-0 group-hover:opacity-100 transition-opacity pr-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </div>
                    </div>

                    {/* Detailed Settings Grid */}
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <div className="px-8 py-5 border-b border-[#f0f2f5] bg-gray-50/50">
                            <h3 className="text-lg font-semibold text-[#111b21]">Application Preferences</h3>
                            <p className="text-sm text-[#667781]">Manage your account features and notification behaviors.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#f0f2f5] border-b border-[#f0f2f5]">
                            <SettingItem
                                icon={<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />}
                                title="Account"
                                description="Security notifications, change number"
                            />
                            <SettingItem
                                icon={<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />}
                                title="Privacy"
                                description="Block contacts, disappearing messages"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#f0f2f5] border-b border-[#f0f2f5]">
                            <SettingItem
                                icon={<path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S8.33 8 7.5 8 6 8.67 6 9.5 6.67 11 7.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H7.89c.8 2.04 2.78 3.5 5.11 3.5z" />}
                                title="Avatar"
                                description="Create, edit, profile photo"
                            />
                            <SettingItem
                                icon={<path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />}
                                title="Chats"
                                description="Theme, wallpapers, chat history"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#f0f2f5]">
                            <SettingItem
                                icon={<path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />}
                                title="Notifications"
                                description="Message, group & call tones"
                            />
                            <SettingItem
                                icon={<path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />}
                                title="Help"
                                description="Help center, contact us, privacy policy"
                            />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

const SettingItem = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="flex items-center p-6 cursor-pointer hover:bg-gray-50 transition-colors group">
        <div className="text-[#8696a0] p-3 bg-gray-100 rounded-xl group-hover:text-brand group-hover:bg-brand/10 transition-colors mr-5">
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                {icon}
            </svg>
        </div>
        <div className="flex-1">
            <div className="text-[17px] text-[#111b21] font-medium group-hover:text-brand transition-colors">{title}</div>
            <div className="text-[14px] text-[#667781] mt-1">{description}</div>
        </div>
    </div>
);
