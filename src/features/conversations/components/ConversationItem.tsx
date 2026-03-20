import React, { useState, useRef, useEffect } from 'react';
import type { Conversation } from '../../../types/conversation.types';
import { useConversationStore } from '../../../store/conversation.store';
import { useAuthStore } from '../../../store/auth.store';
import { useUIStore } from '../../../store/ui.store';
import { formatChatPreviewTime } from '../../../utils/chat';
import { conversationsApi } from '../../../api/conversations.api';
import { usersApi } from '../../../api/users.api';

interface ConversationItemProps {
    conversation: Conversation;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({ conversation }) => {
    const { activeConversationId, setActiveConversation, conversations, setConversations } = useConversationStore();
    const { openImage } = useUIStore();
    const { user } = useAuthStore();
    const isActive = String(activeConversationId) === String(conversation.id);

    const [isDeleting, setIsDeleting] = useState(false);
    const [isBlocking, setIsBlocking] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const otherParticipant = conversation.participants.find(
        (p) => Number(p.userId) !== Number(user?.id)
    );
    const displayName = conversation.isGroup
        ? conversation.title || 'Group Chat'
        : otherParticipant?.user?.username || 'Chat';
    const lastMessage = conversation.lastMessage || conversation.messages?.[0];
    const previewTime = lastMessage ? formatChatPreviewTime(lastMessage) : '';
    const previewContent = lastMessage?.content || 'No messages yet';
    const showUnread = (conversation.unreadCount || 0) > 0;
    const avatarLetter = (displayName || 'C').charAt(0).toUpperCase();

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuOpen]);

    const handleDeleteChat = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setMenuOpen(false);
        if (!window.confirm('Delete this chat? This cannot be undone.')) return;
        setIsDeleting(true);
        try {
            await conversationsApi.deleteConversation(Number(conversation.id));
            // Remove from local store
            setConversations(conversations.filter(c => String(c.id) !== String(conversation.id)));
            if (String(activeConversationId) === String(conversation.id)) {
                setActiveConversation(null);
            }
        } catch (err) {
            console.error('Failed to delete conversation', err);
            alert('Failed to delete chat. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleBlock = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setMenuOpen(false);
        const targetId = otherParticipant?.userId;
        if (!targetId) return;
        if (!window.confirm(`Block ${displayName}? They won't be able to message you.`)) return;
        setIsBlocking(true);
        try {
            await usersApi.blockUser(Number(targetId));
            // Also remove the conversation from view
            setConversations(conversations.filter(c => String(c.id) !== String(conversation.id)));
            if (String(activeConversationId) === String(conversation.id)) {
                setActiveConversation(null);
            }
        } catch (err) {
            console.error('Failed to block user', err);
            alert('Failed to block user. Please try again.');
        } finally {
            setIsBlocking(false);
        }
    };

    return (
        <div
            onClick={() => setActiveConversation(conversation.id)}
            className={`group relative flex items-center px-3 py-2.5 cursor-pointer border-b border-[#1F2937]/50 transition-colors duration-150 ${
                isActive ? 'bg-[#1F2937]' : 'bg-[#111827] hover:bg-[#1F2937]/50'
            }`}
        >
            {/* Avatar */}
            <div
                className={`w-[49px] h-[49px] rounded-full bg-[#374248] flex-shrink-0 flex items-center justify-center font-medium text-[#d1d7db] text-xl overflow-hidden ${otherParticipant?.user?.avatarUrl ? 'cursor-pointer hover:opacity-90' : ''}`}
                onClick={(e) => {
                    if (otherParticipant?.user?.avatarUrl) {
                        e.stopPropagation();
                        openImage(otherParticipant.user.avatarUrl);
                    }
                }}
            >
                {otherParticipant?.user?.avatarUrl ? (
                    <img src={otherParticipant.user.avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                    avatarLetter
                )}
            </div>

            {/* Content */}
            <div className="ml-3 flex-1 min-w-0 py-1 border-b border-[#1F2937] pb-3">
                <div className="flex justify-between items-baseline gap-2">
                    <h3 className="text-[17px] font-normal text-white truncate leading-snug">
                        {displayName}
                    </h3>
                    {/* Show time normally, hide it when menu button is visible on hover */}
                    <span className={`text-[12px] shrink-0 group-hover:hidden ${showUnread ? 'text-[#00a884] font-medium' : 'text-[#aebac1]'}`}>
                        {previewTime}
                    </span>
                    {/* 3-dot menu button — appears on hover */}
                    <div
                        className="hidden group-hover:flex items-center shrink-0 relative"
                        ref={menuRef}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setMenuOpen(prev => !prev);
                            }}
                            className="p-1 rounded-full hover:bg-white/10 text-[#aebac1] hover:text-white transition-colors"
                            title="More options"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 4.001A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 4.001A2 2 0 0 0 12 15z" />
                            </svg>
                        </button>

                        {menuOpen && (
                            <div className="absolute right-0 top-7 w-44 bg-[#233138] rounded-lg shadow-2xl border border-[#313d45] py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-100">
                                <button
                                    onClick={handleBlock}
                                    disabled={isBlocking}
                                    className="w-full text-left px-4 py-2.5 text-[14px] text-[#d1d7db] hover:bg-[#182229] transition-colors flex items-center gap-3 disabled:opacity-50"
                                >
                                    {isBlocking ? (
                                        <div className="w-4 h-4 border-2 border-[#aebac1] border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <svg className="w-4 h-4 text-[#aebac1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                        </svg>
                                    )}
                                    {isBlocking ? 'Blocking...' : 'Block'}
                                </button>
                                <div className="h-px bg-[#313d45] mx-2" />
                                <button
                                    onClick={handleDeleteChat}
                                    disabled={isDeleting}
                                    className="w-full text-left px-4 py-2.5 text-[14px] text-red-400 hover:bg-[#182229] transition-colors flex items-center gap-3 disabled:opacity-50"
                                >
                                    {isDeleting ? (
                                        <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    )}
                                    {isDeleting ? 'Deleting...' : 'Delete chat'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="mt-[2px] flex items-center gap-2">
                    <p className={`text-[14px] truncate flex-1 ${showUnread ? 'text-[#d1d7db] font-medium' : 'text-[#aebac1]'}`}>
                        {previewContent}
                    </p>
                    {showUnread && (
                        <span className="shrink-0 min-w-[20px] h-5 px-1.5 rounded-full bg-[#F97316] text-white text-[11px] font-bold flex items-center justify-center">
                            {conversation.unreadCount! > 99 ? '99+' : conversation.unreadCount}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
