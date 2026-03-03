import React from 'react';
import type { Conversation } from '../../../types/conversation.types';
import { useConversationStore } from '../../../store/conversation.store';
import { useAuthStore } from '../../../store/auth.store';
import { formatChatPreviewTime } from '../../../utils/chat';

interface ConversationItemProps {
    conversation: Conversation;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({ conversation }) => {
    const { activeConversationId, setActiveConversation } = useConversationStore();
    const { user } = useAuthStore();
    const isActive = activeConversationId === conversation.id;

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

    return (
        <div
            onClick={() => setActiveConversation(conversation.id)}
            className={`flex items-center p-4 cursor-pointer transition-colors duration-200 border-l-4 ${isActive
                    ? 'bg-brand/5 border-brand'
                    : 'border-transparent hover:bg-bg-secondary'
                }`}
        >
            <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center font-bold text-gray-500 overflow-hidden">
                {otherParticipant?.user.avatarUrl ? (
                    <img src={otherParticipant.user.avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                    displayName.charAt(0).toUpperCase()
                )}
            </div>
            <div className="ml-4 flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                    <h3 className={`text-sm font-semibold truncate ${isActive ? 'text-brand' : 'text-text-primary'}`}>
                        {displayName}
                    </h3>
                    <span className="text-xs text-text-secondary">
                        {previewTime}
                    </span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                    <p className="text-xs text-text-secondary truncate flex-1">
                        {previewContent}
                    </p>
                    {showUnread && (
                        <span className="min-w-[20px] h-5 px-1 rounded-full bg-brand text-white text-[10px] font-black flex items-center justify-center">
                            {conversation.unreadCount! > 99 ? '99+' : conversation.unreadCount}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
