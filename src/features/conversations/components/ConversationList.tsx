import React, { useEffect } from 'react';
import { ConversationItem } from './ConversationItem';
import { useConversations } from '../../../hooks/useConversations';
import { useUIStore } from '../../../store/ui.store';

export const ConversationList: React.FC = () => {
    const { conversations, fetchConversations, isLoading } = useConversations();
    const { isSidebarOpen, openModal } = useUIStore();

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    if (!isSidebarOpen) return null;

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-100 w-80 overflow-y-auto">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-text-primary">Messages</h2>
                <button
                    type="button"
                    onClick={() => openModal('NEW_CONVERSATION')}
                    className="p-2 hover:bg-bg-secondary rounded-full text-brand transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>

            <div className="flex-1">
                {isLoading ? (
                    <div className="p-4 text-center text-text-secondary">Loading...</div>
                ) : conversations.length === 0 ? (
                    <div className="p-8 text-center text-text-secondary">
                        No conversations yet. Start a new one!
                    </div>
                ) : (
                    conversations.map((conversation) => (
                        <ConversationItem key={conversation.id} conversation={conversation} />
                    ))
                )}
            </div>
        </div>
    );
};
