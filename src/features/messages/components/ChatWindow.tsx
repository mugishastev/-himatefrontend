import React, { useMemo, useState, useRef, useEffect } from 'react';
import { 
    ChevronLeft, 
    Video, 
    Phone, 
    Search, 
    MoreVertical, 
    Image as ImageIcon, 
    X, 
    Info, 
    Trash2, 
    Ban, 
    Lock,
    Zap,
    Paperclip
} from 'lucide-react';
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
import { WallpaperPicker, WALLPAPER_OPTIONS } from './WallpaperPicker';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { useMessageStore } from '../../../store/message.store';

const EMPTY_ARRAY: any[] = [];

export const ChatWindow: React.FC = () => {
    const activeConversationId = useConversationStore((s) => s.activeConversationId);
    const conversations = useConversationStore((s) => s.conversations);
    const setActiveConversation = useConversationStore((s) => s.setActiveConversation);
    const setConversations = useConversationStore((s) => s.setConversations);
    
    const user = useAuthStore((s) => s.user);
    
    const setInfoPane = useUIStore((s) => s.setInfoPane);
    const isInfoPaneOpen = useUIStore((s) => s.isInfoPaneOpen);
    
    const startCall = useCallStore((s) => s.startCall);
    
    const activeConversation = conversations.find(c => c.id === activeConversationId);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isWallpaperOpen, setIsWallpaperOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);

    const conversationMessages = useMessageStore((s) => {
        if (!activeConversationId) return EMPTY_ARRAY;
        return s.messages[String(activeConversationId)] || EMPTY_ARRAY;
    });

    const searchResults = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return [];
        return conversationMessages
            .filter((m: any) => String(m.content || '').toLowerCase().includes(q))
            .slice(-50)
            .reverse();
    }, [conversationMessages, searchQuery]);

    useEffect(() => {
        setIsSearchOpen(false);
        setSearchQuery('');
    }, [activeConversationId]);

    useEffect(() => {
        if (isSearchOpen) {
            setTimeout(() => searchInputRef.current?.focus(), 0);
        }
    }, [isSearchOpen]);

    const scrollToMessage = (messageId: string | number) => {
        const el = document.getElementById(`message-${messageId}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    // ── Wallpaper persistence (now synced with backend) ──
    const activeWallpaper = useMemo(() => {
        const id = user?.chatWallpaper || 'dark-default';
        return WALLPAPER_OPTIONS.find(w => w.id === id) || WALLPAPER_OPTIONS[0];
    }, [user?.chatWallpaper]);

    const handleWallpaperSelect = async (next: { id: string; style: React.CSSProperties }) => {
        if (!user?.id) return;
        try {
            await usersApi.update(Number(user.id), { chatWallpaper: next.id });
            useAuthStore.getState().updateUser({ chatWallpaper: next.id });
        } catch (err) {
            console.error('Failed to save wallpaper preference', err);
        }
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

    useDocumentTitle(activeConversationId ? `Chatting with ${displayName}` : 'Dashboard');

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
        <div className="flex-1 flex flex-col h-full min-w-0 relative overflow-hidden bg-[#0b141a]">
            {/* Wallpaper Layer */}
            <div 
                className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300" 
                style={{ 
                    ...activeWallpaper.style, 
                    opacity: (user?.wallpaperOpacity ?? 100) / 100 
                }} 
            />

            {activeConversationId ? (
                <div className="flex-1 flex flex-col relative z-10">
                    <header className="h-[60px] bg-[#f0f2f5] border-b border-gray-200 flex items-center justify-between px-4 shrink-0 z-20 sticky top-0">
                        {/* Mobile Back Button */}
                        <button 
                            onClick={() => setActiveConversation(null)}
                            className="md:hidden mr-2 p-2 rounded-full hover:bg-black/5 text-[#54656f] transition-colors"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>

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
                                    <Video className="w-5 h-5" strokeWidth={2} />
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
                                    <Phone className="w-5 h-5" strokeWidth={2} />
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
                                onClick={() => setIsSearchOpen(true)}
                            >
                                <Search className="w-5 h-5" strokeWidth={2} />
                            </button>
                            <button
                                type="button"
                                className={`p-2 rounded-full transition-colors ${isMenuOpen ? 'bg-black/10' : 'hover:bg-black/5'}`}
                                title="Menu"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <MoreVertical className="w-5 h-5" strokeWidth={2} />
                            </button>

                            {/* Dropdown Menu */}
                            {isMenuOpen && (
                                <div className="absolute right-0 top-12 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-100">
                                    <button
                                         onClick={() => {
                                             setIsMenuOpen(false);
                                             setInfoPane(!isInfoPaneOpen, activeConversation?.isGroup ? 'GROUP' : 'CONTACT');
                                         }}
                                         className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-[14.5px] text-[#3b4a54] flex items-center gap-2"
                                     >
                                         <Info className="w-4 h-4" />
                                         Contact info
                                     </button>
                                     <button
                                         onClick={() => {
                                             setIsMenuOpen(false);
                                             setIsWallpaperOpen(true);
                                         }}
                                         className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-[14.5px] text-[#3b4a54] flex items-center gap-2"
                                     >
                                         <ImageIcon className="w-4 h-4" />
                                         Change wallpaper
                                     </button>
                                     <button
                                         onClick={() => {
                                             setIsMenuOpen(false);
                                             setActiveConversation(null);
                                         }}
                                         className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-[14.5px] text-[#3b4a54] flex items-center gap-2"
                                     >
                                         <X className="w-4 h-4" />
                                         Close chat
                                     </button>
                                     
                                     <div className="h-px bg-gray-100 my-1 mx-2"></div>
                                     
                                     {/* Action items */}
                                     {!activeConversation?.isGroup && (
                                         <button
                                             onClick={handleBlockUser}
                                             className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-[14.5px] text-[#3b4a54] flex items-center gap-2"
                                         >
                                             <Ban className="w-4 h-4" />
                                             Block user
                                         </button>
                                     )}
                                     <button
                                         onClick={handleDeleteChat}
                                         className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-500 transition-colors text-[14.5px] flex items-center gap-2"
                                     >
                                         <Trash2 className="w-4 h-4" />
                                         Delete chat
                                     </button>
                                 </div>
                            )}
                        </div>
                    </header>

                    {isSearchOpen && (
                        <div className="fixed inset-0 z-50">
                            <button
                                type="button"
                                className="absolute inset-0 bg-black/40"
                                onClick={() => setIsSearchOpen(false)}
                                aria-label="Close search"
                            />
                            <div className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-2xl border-l border-gray-200 flex flex-col">
                                <div className="p-4 border-b border-gray-200 flex items-center gap-2">
                                    <input
                                        ref={searchInputRef}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search in this chat..."
                                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-brand"
                                    />
                                    <button
                                        type="button"
                                        className="p-2 rounded-xl hover:bg-gray-100 text-gray-600"
                                        onClick={() => setIsSearchOpen(false)}
                                        aria-label="Close"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto p-3">
                                    {!searchQuery.trim() ? (
                                        <div className="text-sm text-gray-500 p-3">
                                            Type to search message text in this conversation.
                                        </div>
                                    ) : searchResults.length === 0 ? (
                                        <div className="text-sm text-gray-500 p-3">
                                            No matches found.
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {searchResults.map((m: any) => (
                                                <button
                                                    key={m.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setIsSearchOpen(false);
                                                        setTimeout(() => scrollToMessage(m.id), 0);
                                                    }}
                                                    className="w-full text-left p-3 rounded-xl border border-gray-200 hover:border-brand/40 hover:bg-brand/5 transition-colors"
                                                >
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="text-xs font-semibold text-gray-600 truncate">
                                                            {m.sender?.username || 'User'}
                                                        </span>
                                                        <span className="text-[11px] text-gray-400 whitespace-nowrap">
                                                            {new Date(m.createdAt || m.timestamp || Date.now()).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                                                        {m.content || ''}
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <MessageList />
                    <MessageInput />
                </div>
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
                            { icon: Lock, label: 'End-to-end encrypted', color: 'text-green-500' },
                            { icon: Zap, label: 'Real-time messaging', color: 'text-yellow-500' },
                            { icon: Paperclip, label: 'Share files & media', color: 'text-blue-500' },
                        ].map(f => (
                            <span key={f.label} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1F2937] border border-white/10 text-[#9CA3AF] text-xs font-medium">
                                <f.icon className={`w-3.5 h-3.5 ${f.color}`} />
                                {f.label}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Wallpaper picker modal */}
            {isWallpaperOpen && (
                <WallpaperPicker
                    currentId={activeWallpaper.id}
                    onSelect={handleWallpaperSelect}
                    onClose={() => setIsWallpaperOpen(false)}
                />
            )}
        </div>
    );
};
