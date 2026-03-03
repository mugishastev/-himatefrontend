import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAuthStore } from '../../../store/auth.store';
import { UserAvatar } from './UserAvatar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { usersApi } from '../../../api/users.api';
import { useProfilePreferencesStore } from '../../../store/profile-preferences.store';
import { useUserStore } from '../../../store/user.store';
import { contactsApi } from '../../../api/contacts.api';
import { conversationsApi } from '../../../api/conversations.api';
import { useConversationStore } from '../../../store/conversation.store';
import { useMessageStore } from '../../../store/message.store';
import { StatusComposer } from '../../status/components/StatusComposer';
import { StatusFeed } from '../../status/components/StatusFeed';
import { formatRelativeTime } from '../../../utils/date';

const SectionCard: React.FC<{ title: string; subtitle?: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
    <Card className="p-6 space-y-4">
        <div>
            <h3 className="text-lg font-black text-text-primary tracking-tight">{title}</h3>
            {subtitle && <p className="text-sm text-text-secondary">{subtitle}</p>}
        </div>
        {children}
    </Card>
);

const ToggleRow: React.FC<{
    label: string;
    description?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}> = ({ label, description, checked, onChange }) => (
    <label className="flex items-start justify-between gap-4 py-2">
        <div>
            <p className="font-semibold text-text-primary">{label}</p>
            {description && <p className="text-xs text-text-secondary">{description}</p>}
        </div>
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="mt-1 h-4 w-4 accent-[var(--brand-primary)]"
        />
    </label>
);

export const ProfileView: React.FC = () => {
    const { user, updateUser, logout } = useAuthStore();
    const { contacts, setContacts, onlineUsers } = useUserStore();
    const { conversations, setConversations } = useConversationStore();
    const { messages } = useMessageStore();

    const {
        darkMode,
        themeColor,
        showEmail,
        showPhone,
        showLastSeen,
        profileVisibility,
        statusVisibility,
        endToEndEncryption,
        blockedUsers,
        mutedChats,
        notificationSound,
        toggleDarkMode,
        setThemeColor,
        setShowEmail,
        setShowPhone,
        setShowLastSeen,
        setProfileVisibility,
        setStatusVisibility,
        setEndToEndEncryption,
        addBlockedUser,
        removeBlockedUser,
        toggleMutedChat,
        setNotificationSound,
    } = useProfilePreferencesStore();

    const [statusRefreshKey, setStatusRefreshKey] = useState(0);
    const [isEditingIdentity, setIsEditingIdentity] = useState(false);
    const [isSavingIdentity, setIsSavingIdentity] = useState(false);
    const [blockedInput, setBlockedInput] = useState('');
    const [identityForm, setIdentityForm] = useState({
        username: user?.username || '',
        bio: user?.bio || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!user?.id) return;
        setIdentityForm({
            username: user.username || '',
            bio: user.bio || '',
            email: user.email || '',
            phoneNumber: user.phoneNumber || '',
        });
    }, [user?.bio, user?.email, user?.id, user?.phoneNumber, user?.username]);

    useEffect(() => {
        if (!user?.id) return;
        const loadSocialGraph = async () => {
            try {
                const [contactsResult, conversationsResult] = await Promise.all([
                    contactsApi.getUserContacts(Number(user.id)),
                    conversationsApi.getConversations(Number(user.id)),
                ]);
                setContacts((contactsResult.data || contactsResult) as any[]);
                setConversations((conversationsResult.data || conversationsResult) as any[]);
            } catch (error) {
                console.error('Failed to load profile social graph', error);
            }
        };
        loadSocialGraph();
    }, [setContacts, setConversations, user?.id]);

    const handleSaveIdentity = async () => {
        if (!user?.id) return;
        setIsSavingIdentity(true);
        try {
            const updated = await usersApi.update(Number(user.id), {
                username: identityForm.username,
                bio: identityForm.bio,
                email: identityForm.email,
                phoneNumber: identityForm.phoneNumber,
            });
            updateUser({
                username: updated.username,
                bio: updated.bio,
                email: updated.email,
                phoneNumber: updated.phoneNumber,
            });
            setIsEditingIdentity(false);
        } catch (error) {
            console.error('Failed to update profile identity', error);
        } finally {
            setIsSavingIdentity(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user?.id) return;
        try {
            const result = await usersApi.uploadProfileImage(Number(user.id), file);
            updateUser({ profileImage: result.profileImage, avatarUrl: result.profileImage });
        } catch (error) {
            console.error('Failed to upload profile image', error);
        }
    };

    const isOnline = user?.id ? onlineUsers.includes(String(user.id)) : false;
    const groups = useMemo(
        () => conversations.filter((conv) => conv.isGroup),
        [conversations]
    );
    const profileLink = user ? `${window.location.origin}/profile/${user.id}` : '';

    const mediaItems = useMemo(() => {
        const allMessages = Object.values(messages).flat();
        const media = allMessages
            .filter((msg) => !!msg.mediaUrl)
            .map((msg) => ({ type: 'media', value: msg.mediaUrl as string, id: `m-${msg.id}` }));
        const links = allMessages.flatMap((msg) => {
            const matches = (msg.content || '').match(/https?:\/\/[^\s]+/g) || [];
            return matches.map((link, idx) => ({ type: 'link', value: link, id: `l-${msg.id}-${idx}` }));
        });
        return [...media, ...links].slice(-40).reverse();
    }, [messages]);

    if (!user) return null;

    return (
        <div className="flex-1 overflow-y-auto bg-bg-secondary p-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-6">
                <section className="xl:col-span-1 space-y-6">
                    <Card className="p-6 text-center">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="mx-auto group relative"
                            title="Upload profile picture"
                        >
                            <UserAvatar user={user} size="xl" />
                            <span className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                        />
                        <h2 className="mt-4 text-2xl font-black text-text-primary">{user.username}</h2>
                        <p className="text-sm text-text-secondary mt-1">{showEmail ? user.email : 'Email hidden'}</p>
                        <p className="text-xs mt-3 text-text-secondary">
                            {isOnline ? 'Online now' : showLastSeen && user.lastSeen ? `Last seen ${formatRelativeTime(user.lastSeen)}` : 'Offline'}
                        </p>
                        <div className="mt-4 flex gap-2 justify-center">
                            <Button size="sm" variant="outline" onClick={() => setIsEditingIdentity((v) => !v)}>
                                {isEditingIdentity ? 'Close Edit' : 'Edit Profile'}
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={logout}>
                                Logout
                            </Button>
                        </div>
                    </Card>

                    <SectionCard title="QR Code / Unique ID" subtitle="Share this to connect quickly">
                        <div className="flex gap-4 items-center">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(profileLink)}`}
                                alt="Profile QR code"
                                className="w-28 h-28 rounded-xl border border-gray-200"
                            />
                            <div className="min-w-0">
                                <p className="text-xs text-text-secondary">Unique ID</p>
                                <p className="font-mono text-sm text-text-primary break-all">{`UID-${user.id}`}</p>
                                <p className="text-xs text-text-secondary mt-2">Profile Link</p>
                                <p className="text-xs text-brand break-all">{profileLink}</p>
                            </div>
                        </div>
                    </SectionCard>
                </section>

                <section className="xl:col-span-2 space-y-6">
                    <SectionCard title="1. Personal Identity & Profile Details" subtitle="Manage your main profile data">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Display Name / Username"
                                value={identityForm.username}
                                disabled={!isEditingIdentity}
                                onChange={(e) => setIdentityForm((prev) => ({ ...prev, username: e.target.value }))}
                            />
                            <Input
                                label="Email"
                                type="email"
                                value={identityForm.email}
                                disabled={!isEditingIdentity}
                                onChange={(e) => setIdentityForm((prev) => ({ ...prev, email: e.target.value }))}
                            />
                            <Input
                                label="Phone Number"
                                value={identityForm.phoneNumber}
                                disabled={!isEditingIdentity}
                                onChange={(e) => setIdentityForm((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                            />
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-text-secondary">Bio / About Me</label>
                                <textarea
                                    value={identityForm.bio}
                                    disabled={!isEditingIdentity}
                                    onChange={(e) => setIdentityForm((prev) => ({ ...prev, bio: e.target.value }))}
                                    rows={3}
                                    className="mt-1 w-full p-3 bg-bg-secondary border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-brand disabled:opacity-80"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <ToggleRow label="Show email to others" checked={showEmail} onChange={setShowEmail} />
                            <ToggleRow label="Show phone to others" checked={showPhone} onChange={setShowPhone} />
                        </div>
                        {isEditingIdentity && (
                            <div className="flex justify-end">
                                <Button onClick={handleSaveIdentity} isLoading={isSavingIdentity}>
                                    Save Identity Changes
                                </Button>
                            </div>
                        )}
                    </SectionCard>

                    <SectionCard title="2. Real-Time Activity & Social Presence" subtitle="Online status and stories/blog updates">
                        <ToggleRow
                            label="Show Last Seen"
                            description="Allow contacts to see your activity timestamp."
                            checked={showLastSeen}
                            onChange={setShowLastSeen}
                        />
                        <div className="pt-2">
                            <StatusComposer onCreated={() => setStatusRefreshKey((v) => v + 1)} />
                        </div>
                        <StatusFeed refreshKey={statusRefreshKey} />
                    </SectionCard>

                    <SectionCard title="3. Settings & Customization" subtitle="Theme, privacy, security and notifications">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <p className="font-semibold text-text-primary">UI Customization</p>
                                <ToggleRow label="Dark Mode" checked={darkMode} onChange={() => toggleDarkMode()} />
                                <label className="text-sm text-text-secondary">Chat Color Theme</label>
                                <select
                                    value={themeColor}
                                    onChange={(e) => setThemeColor(e.target.value as 'orange' | 'blue' | 'emerald')}
                                    className="w-full bg-bg-secondary border border-gray-200 rounded-lg p-2"
                                >
                                    <option value="orange">Orange</option>
                                    <option value="blue">Blue</option>
                                    <option value="emerald">Emerald</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <p className="font-semibold text-text-primary">Privacy & Security</p>
                                <ToggleRow label="End-to-End Encryption" checked={endToEndEncryption} onChange={setEndToEndEncryption} />
                                <label className="text-sm text-text-secondary">Profile Visibility</label>
                                <select
                                    value={profileVisibility}
                                    onChange={(e) => setProfileVisibility(e.target.value as 'everyone' | 'contacts' | 'nobody')}
                                    className="w-full bg-bg-secondary border border-gray-200 rounded-lg p-2"
                                >
                                    <option value="everyone">Everyone</option>
                                    <option value="contacts">Contacts Only</option>
                                    <option value="nobody">Nobody</option>
                                </select>
                                <label className="text-sm text-text-secondary">Story/Status Visibility</label>
                                <select
                                    value={statusVisibility}
                                    onChange={(e) => setStatusVisibility(e.target.value as 'everyone' | 'contacts' | 'nobody')}
                                    className="w-full bg-bg-secondary border border-gray-200 rounded-lg p-2"
                                >
                                    <option value="everyone">Everyone</option>
                                    <option value="contacts">Contacts Only</option>
                                    <option value="nobody">Nobody</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-gray-100 space-y-3">
                            <p className="font-semibold text-text-primary">Blocked Users</p>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Type username/email to block"
                                    value={blockedInput}
                                    onChange={(e) => setBlockedInput(e.target.value)}
                                />
                                <Button
                                    onClick={() => {
                                        addBlockedUser(blockedInput);
                                        setBlockedInput('');
                                    }}
                                >
                                    Block
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {blockedUsers.length === 0 && <span className="text-sm text-text-secondary">No blocked users.</span>}
                                {blockedUsers.map((u) => (
                                    <button
                                        key={u}
                                        onClick={() => removeBlockedUser(u)}
                                        className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold"
                                    >
                                        {u} x
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-2 border-t border-gray-100 space-y-2">
                            <p className="font-semibold text-text-primary">Notifications</p>
                            <label className="text-sm text-text-secondary">Notification Sound</label>
                            <select
                                value={notificationSound}
                                onChange={(e) => setNotificationSound(e.target.value as 'default' | 'soft' | 'none')}
                                className="w-full md:w-56 bg-bg-secondary border border-gray-200 rounded-lg p-2"
                            >
                                <option value="default">Default</option>
                                <option value="soft">Soft</option>
                                <option value="none">Mute all</option>
                            </select>
                            <div className="space-y-1">
                                {conversations.slice(0, 8).map((conv) => (
                                    <label key={String(conv.id)} className="flex items-center justify-between py-1">
                                        <span className="text-sm text-text-primary truncate pr-4">
                                            {conv.isGroup ? conv.title || 'Group' : 'Direct Chat'}
                                        </span>
                                        <input
                                            type="checkbox"
                                            checked={mutedChats.includes(String(conv.id))}
                                            onChange={() => toggleMutedChat(conv.id)}
                                            className="h-4 w-4 accent-[var(--brand-primary)]"
                                        />
                                    </label>
                                ))}
                            </div>
                        </div>
                    </SectionCard>

                    <SectionCard title="4. Social Graph & Networking" subtitle="Contacts and group memberships">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="font-semibold text-text-primary mb-2">Contacts ({contacts.length})</p>
                                <div className="max-h-52 overflow-auto space-y-2 pr-1">
                                    {contacts.length === 0 && <p className="text-sm text-text-secondary">No contacts yet.</p>}
                                    {contacts.map((c) => (
                                        <div key={String(c.id)} className="p-2 rounded-lg border border-gray-100 bg-bg-secondary">
                                            <p className="text-sm font-semibold text-text-primary">{c.username}</p>
                                            <p className="text-xs text-text-secondary">{c.email}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="font-semibold text-text-primary mb-2">Groups ({groups.length})</p>
                                <div className="max-h-52 overflow-auto space-y-2 pr-1">
                                    {groups.length === 0 && <p className="text-sm text-text-secondary">No groups yet.</p>}
                                    {groups.map((group) => (
                                        <div key={String(group.id)} className="p-2 rounded-lg border border-gray-100 bg-bg-secondary">
                                            <p className="text-sm font-semibold text-text-primary">{group.title || `Group #${group.id}`}</p>
                                            <p className="text-xs text-text-secondary">
                                                {group.participants?.length || 0} participants
                                            </p>
                                            <p className="text-xs text-text-secondary truncate mt-1">
                                                {(group.participants || []).map((p) => p.user?.username).filter(Boolean).join(', ')}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </SectionCard>

                    <SectionCard title="5. Advanced Management Tools" subtitle="Media gallery and shared links">
                        <p className="text-sm text-text-secondary">
                            Shared Files Gallery ({mediaItems.length}) from loaded conversations.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {mediaItems.length === 0 && (
                                <p className="text-sm text-text-secondary">No shared media or links found yet.</p>
                            )}
                            {mediaItems.map((item) => (
                                <a
                                    key={item.id}
                                    href={item.value}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block p-3 rounded-lg border border-gray-100 bg-bg-secondary hover:border-brand transition-colors"
                                >
                                    <p className="text-xs uppercase tracking-widest text-text-secondary">{item.type}</p>
                                    <p className="text-sm text-brand truncate">{item.value}</p>
                                </a>
                            ))}
                        </div>
                    </SectionCard>
                </section>
            </div>
        </div>
    );
};
