import React from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useConversationStore } from '../../../store/conversation.store';
import { UserAvatar } from '../../users/components/UserAvatar';
import { useAuthStore } from '../../../store/auth.store';
import { useUIStore } from '../../../store/ui.store';

export const ChatWindow: React.FC = () => {
    const { activeConversationId, conversations } = useConversationStore();
    const { user } = useAuthStore();
    const { setInfoPane, isInfoPaneOpen } = useUIStore();
    const activeConversation = conversations.find(c => c.id === activeConversationId);

    const otherParticipant = activeConversation?.participants.find(
        (p) => Number(p.userId) !== Number(user?.id)
    );
    const displayName = activeConversation?.isGroup
        ? activeConversation.title
        : otherParticipant?.user.username || 'Chat';
    const subtitle = activeConversation?.isGroup
        ? `${activeConversation.participants.length} members`
        : (otherParticipant?.user?.status || 'Active');

    return (
        <div className="flex-1 flex flex-col bg-[#efeae2] h-full min-w-0 relative">
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
                        <div className="flex items-center gap-1 text-[#54656f]">
                            <button
                                type="button"
                                className="p-2 hover:bg-black/5 rounded-full transition-colors"
                                title="Search messages"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M15.07 14.25h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0a4.75 4.75 0 1 1 0-9.5 4.75 4.75 0 0 1 0 9.5z" /></svg>
                            </button>
                            <button
                                type="button"
                                className="p-2 hover:bg-black/5 rounded-full transition-colors"
                                title="More options"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 4.001A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 4.001A2 2 0 0 0 12 15z" /></svg>
                            </button>
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
    );
};
