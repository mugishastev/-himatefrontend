import React from 'react';
import type { Conversation } from '../../../types/conversation.types';
import { useConversationStore } from '../../../store/conversation.store';

interface ConversationItemProps {
    conversation: Conversation;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({ conversation }) => {
    const { activeConversationId, setActiveConversation } = useConversationStore();
    const isActive = activeConversationId === conversation.id;

    const otherParticipant = conversation.participants.find(p => p.isAdmin === false); // Simplified logic
    const displayName = conversation.isGroup ? conversation.title : otherParticipant?.user.username || 'Chat';

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
                        {conversation.lastMessage ? new Date(conversation.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                </div>
                <p className="text-xs text-text-secondary truncate mt-1">
                    {conversation.lastMessage?.content || 'No messages yet'}
                </p>
            </div>
        </div>
    );
};
