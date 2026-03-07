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
        : (otherParticipant?.user?.email || 'Direct conversation');

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
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center border-b-[6px] border-[#25D366] bg-[#f0f2f5] relative overflow-hidden z-20">
                    <img
                        src="https://static.whatsapp.net/rsrc.php/v3/y6/r/wa66ilXUu0v.png"
                        alt="WhatsApp Web"
                        className="w-[320px] max-w-full opacity-80 mb-8"
                    />
                    <h2 className="text-[32px] font-light text-[#41525d] mb-4">Himate Web</h2>
                    <p className="text-[14px] text-[#667781] max-w-lg leading-relaxed mb-8">
                        Send and receive messages without keeping your phone online.<br />
                        Use Himate on up to 4 linked devices and 1 phone at the same time.
                    </p>
                    <div className="flex items-center gap-1 text-[13px] text-[#8696a0]">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
                        </svg>
                        End-to-end encrypted
                    </div>
                </div>
            )}
        </div>
    );
};
