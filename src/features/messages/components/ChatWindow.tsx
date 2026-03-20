import React, { useState, useRef, useEffect } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useConversationStore } from '../../../store/conversation.store';
import { UserAvatar } from '../../users/components/UserAvatar';
import { useAuthStore } from '../../../store/auth.store';
import { useUIStore } from '../../../store/ui.store';
import { useCallStore } from '../../../store/call.store';
import { conversationsApi } from '../../../api/conversations.api';
import { usersApi } from '../../../api/users.api';
import { callsApi } from '../../../api/calls.api';
import { socketEmitters } from '../../../socket/socket.emitters';
import { WallpaperPicker, WALLPAPER_OPTIONS, WALLPAPER_STORAGE_KEY } from './WallpaperPicker';

export const ChatWindow: React.FC = () => {
    const { activeConversationId, conversations, setActiveConversation, setConversations } = useConversationStore();
    const { user } = useAuthStore();
    const { setInfoPane, isInfoPaneOpen } = useUIStore();
    const { startCall } = useCallStore();
    const activeConversation = conversations.find(c => c.id === activeConversationId);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isWallpaperOpen, setIsWallpaperOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // ── Wallpaper persistence ──────────────────────────────────
    const savedWallpaper = (() => {
        try {
            const raw = localStorage.getItem(WALLPAPER_STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch { return null; }
    })();
    const defaultWallpaper = WALLPAPER_OPTIONS.find(w => w.id === 'dark-default')!;
    const [wallpaper, setWallpaper] = useState<{ id: string; style: React.CSSProperties }>(
        savedWallpaper ?? { id: defaultWallpaper.id, style: defaultWallpaper.style }
    );

    const handleWallpaperSelect = (next: { id: string; style: React.CSSProperties }) => {
        setWallpaper(next);
        localStorage.setItem(WALLPAPER_STORAGE_KEY, JSON.stringify(next));
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        if (isMenuOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMenuOpen]);

    const otherParticipant = activeConversation?.participants.find(
        (p) => Number(p.userId) !== Number(user?.id)
    );
    const displayName = activeConversation?.isGroup
        ? activeConversation.title
        : otherParticipant?.user.username || 'Chat';
    const subtitle = activeConversation?.isGroup
        ? `${activeConversation.participants.length} members`
        : (otherParticipant?.user?.status || 'Active');

    const handleDeleteChat = async () => {
        setIsMenuOpen(false);
        if (!activeConversationId) return;
        if (!window.confirm('Delete this chat? This cannot be undone.')) return;
        try {
            await conversationsApi.deleteConversation(Number(activeConversationId));
            setConversations(conversations.filter(c => String(c.id) !== String(activeConversationId)));
            setActiveConversation(null);
        } catch (err) {
            console.error('Failed to delete chat', err);
            alert('Failed to delete chat.');
        }
    };

    const handleBlockUser = async () => {
        setIsMenuOpen(false);
        const targetId = otherParticipant?.userId;
        if (!targetId || activeConversation?.isGroup) return;
        if (!window.confirm(`Block ${displayName}? They won't be able to message you.`)) return;
        try {
            await usersApi.blockUser(Number(targetId));
            setConversations(conversations.filter(c => String(c.id) !== String(activeConversationId)));
            setActiveConversation(null);
        } catch (err) {
            console.error('Failed to block user', err);
            alert('Failed to block user.');
        }
    };

    const handleCall = async (type: 'AUDIO' | 'VIDEO') => {
        const targetId = otherParticipant?.userId;
        if (!targetId || !user?.id) return;
        if (activeConversation?.isGroup) {
            alert('Group calls are not supported yet!');
            return;
        }

        try {
            await callsApi.createCall({
                callerId: Number(user.id),
                receiverId: Number(targetId),
                startedAt: new Date().toISOString(),
                type
            });
            // Emit via WebSocket to trigger incoming call UI on recipient's end
            socketEmitters.initiateCall(targetId, type, activeConversationId || 0);
            
            // Trigger actual UI overlay locally
            if (otherParticipant) {
                startCall(otherParticipant, type);
            }
        } catch (err) {
            console.error('Failed to place call', err);
            alert('Could not start call due to a server error.');
        }
    };

    return (
        <>
        <div className="flex-1 flex flex-col h-full min-w-0 relative" style={wallpaper.style}>
            {activeConversationId ? (
                <>
                    <header className="h-[60px] bg-[#f0f2f5] border-b border-gray-200 flex items-center justify-between px-4 shrink-0 z-10 relative">
                        <div
                            className="flex items-center space-x-3 cursor-pointer flex-1 min-w-0 h-full"
                            onClick={() => setInfoPane(!isInfoPaneOpen, activeConversation?.isGroup ? 'GROUP' : 'CONTACT')}
                        >
                            {otherParticipant?.user ? (
                                <UserAvatar user={otherParticipant.user} size="sm" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center font-bold text-brand shadow-sm border border-gray-200 shrink-0">
                                    {(displayName || 'C').charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-[#111b21] leading-tight truncate">
                                    {displayName || 'Chat'}
                                </h3>
                                <p className="text-[13px] text-[#667781] truncate">
                                    {activeConversation?.isGroup ? subtitle : 'click here for contact info'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-[#54656f] relative" ref={menuRef}>
                            {/* Video Call Button */}
                            {!activeConversation?.isGroup && (
                                <button
                                    type="button"
                                    className="p-2 hover:bg-black/5 rounded-full transition-colors hidden sm:block"
                                    title="Video call"
                                    onClick={() => handleCall('VIDEO')}
                                >
                                    <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                                </button>
                            )}
                            
                            {/* Audio Call Button */}
                            {!activeConversation?.isGroup && (
                                <button
                                    type="button"
                                    className="p-2 mr-1 hover:bg-black/5 rounded-full transition-colors hidden sm:block"
                                    title="Voice call"
                                    onClick={() => handleCall('AUDIO')}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                                </button>
                            )}

                            {/* Optional small separator if desired */}
                            {!activeConversation?.isGroup && (
                                <div className="h-6 w-px bg-gray-300 hidden sm:block mx-1"></div>
                            )}

                            {/* Search Button */}
                            <button
                                type="button"
                                className="p-2 hover:bg-black/5 rounded-full transition-colors"
                                title="Search messages"
                                onClick={() => {
                                    // Normally this opens a search pane on the right. We simulate it for now.
                                    alert('Search messages functionality coming soon!');
                                }}
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M15.07 14.25h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0a4.75 4.75 0 1 1 0-9.5 4.75 4.75 0 0 1 0 9.5z" /></svg>
                            </button>
                            <button
                                type="button"
                                className={`p-2 rounded-full transition-colors ${isMenuOpen ? 'bg-black/10' : 'hover:bg-black/5'}`}
                                title="Menu"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 4.001A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 4.001A2 2 0 0 0 12 15z" /></svg>
                            </button>

                            {/* Dropdown Menu */}
                            {isMenuOpen && (
                                <div className="absolute right-0 top-12 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-100">
                                    <button
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            setInfoPane(!isInfoPaneOpen, activeConversation?.isGroup ? 'GROUP' : 'CONTACT');
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-[14.5px] text-[#3b4a54]"
                                    >
                                        Contact info
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            setIsWallpaperOpen(true);
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-[14.5px] text-[#3b4a54] flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Change wallpaper
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            setActiveConversation(null);
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-[14.5px] text-[#3b4a54]"
                                    >
                                        Close chat
                                    </button>
                                    
                                    <div className="h-px bg-gray-100 my-1 mx-2"></div>
                                    
                                    {/* Action items */}
                                    {!activeConversation?.isGroup && (
                                        <button
                                            onClick={handleBlockUser}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-[14.5px] text-[#3b4a54]"
                                        >
                                            Block user
                                        </button>
                                    )}
                                    <button
                                        onClick={handleDeleteChat}
                                        className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-500 transition-colors text-[14.5px]"
                                    >
                                        Delete chat
                                    </button>
                                </div>
                            )}
                        </div>
                    </header>

                    <MessageList />
                    <MessageInput />
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#111827] relative overflow-hidden z-20">
                    {/* Subtle background glow */}
                    <div className="absolute w-96 h-96 rounded-full bg-[#F97316]/5 blur-3xl pointer-events-none" />

                    {/* Logo */}
                    <div className="relative mb-8">
                        <div className="w-28 h-28 rounded-3xl bg-[#1F2937] border border-white/10 flex items-center justify-center shadow-xl overflow-hidden">
                            <img src="/logo.png" alt="Himate" className="w-20 h-20 object-contain" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#F97316] flex items-center justify-center shadow-lg">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                            </svg>
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl font-bold text-white mb-3">Himate Web</h2>
                    <p className="text-[#9CA3AF] text-sm max-w-sm leading-relaxed mb-8">
                        Select a conversation from the list to start chatting.<br />
                        Your messages are private and secure.
                    </p>

                    {/* Feature pills */}
                    <div className="flex flex-wrap gap-3 justify-center">
                        {[
                            { icon: '🔒', label: 'End-to-end encrypted' },
                            { icon: '⚡', label: 'Real-time messaging' },
                            { icon: '📎', label: 'Share files & media' },
                        ].map(f => (
                            <span key={f.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1F2937] border border-white/10 text-[#9CA3AF] text-xs font-medium">
                                <span>{f.icon}</span>{f.label}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
        {/* Wallpaper picker modal */}
        {isWallpaperOpen && (
            <WallpaperPicker
                currentId={wallpaper.id}
                onSelect={handleWallpaperSelect}
                onClose={() => setIsWallpaperOpen(false)}
            />
        )}
        </>
    );
};
