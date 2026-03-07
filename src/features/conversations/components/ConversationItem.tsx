import React from 'react';
import type { Conversation } from '../../../types/conversation.types';
import { useConversationStore } from '../../../store/conversation.store';
import { useAuthStore } from '../../../store/auth.store';
import { useUIStore } from '../../../store/ui.store';
import { formatChatPreviewTime } from '../../../utils/chat';

interface ConversationItemProps {
    conversation: Conversation;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({ conversation }) => {
    const { activeConversationId, setActiveConversation } = useConversationStore();
    const { openImage } = useUIStore();
    const { user } = useAuthStore();
    const isActive = String(activeConversationId) === String(conversation.id);

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

    return (
        <div
            onClick={() => setActiveConversation(conversation.id)}
            className={`flex items-center px-3 py-2.5 cursor-pointer border-b border-[#f0f2f5] transition-colors duration-150 ${isActive ? 'bg-[#f0f2f5]' : 'bg-white hover:bg-[#f5f6f6]'
                }`}
        >
            <div
                className={`w-[49px] h-[49px] rounded-full bg-[#dfe5e7] flex-shrink-0 flex items-center justify-center font-medium text-[#667781] text-xl overflow-hidden ${otherParticipant?.user?.avatarUrl ? 'cursor-pointer hover:opacity-90' : ''}`}
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
            <div className="ml-3 flex-1 min-w-0 py-1">
                <div className="flex justify-between items-baseline gap-2">
                    <h3 className="text-[17px] font-normal text-[#111b21] truncate leading-snug">
                        {displayName}
                    </h3>
                    <span className={`text-[11px] shrink-0 ${showUnread ? 'text-[#25d366]' : 'text-[#667781]'}`}>
                        {previewTime}
                    </span>
                </div>
                <div className="mt-px flex items-center gap-2">
                    <p className="text-[14px] text-[#667781] truncate flex-1">
                        {previewContent}
                    </p>
                    {showUnread && (
                        <span className="shrink-0 min-w-[20px] h-5 px-1 rounded-full bg-[#25d366] text-white text-[11px] flex items-center justify-center">
                            {conversation.unreadCount! > 99 ? '99+' : conversation.unreadCount}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
