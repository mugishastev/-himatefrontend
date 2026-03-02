import React, { useEffect, useRef } from 'react';
import { MessageItem } from './MessageItem';
import { TypingIndicator } from './TypingIndicator';
import { useMessages } from '../../../hooks/useMessages';
import { useConversationStore } from '../../../store/conversation.store';
import { useTypingIndicator } from '../../../hooks/useTypingIndicator';

export const MessageList: React.FC = () => {
    const { activeConversationId, typingUsers } = useConversationStore();
    const { messages, fetchMessages } = useMessages();
    const bottomRef = useRef<HTMLDivElement>(null);

    // Subscribe to typing events
    useTypingIndicator(activeConversationId);

    const isAnyoneTyping = activeConversationId && typingUsers[activeConversationId]?.length > 0;

    useEffect(() => {
        if (activeConversationId) {
            fetchMessages(activeConversationId);
        }
    }, [activeConversationId, fetchMessages]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!activeConversationId) {
        return (
            <div className="flex-1 flex items-center justify-center bg-bg-secondary">
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center mx-auto text-brand">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-text-primary">Your Messages</h2>
                    <p className="text-text-secondary max-w-xs mx-auto">
                        Select a conversation from the sidebar to start chatting with your friends.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white/50 backdrop-blur-sm">
            {messages.map((message) => (
                <MessageItem key={message.id} message={message} />
            ))}

            {isAnyoneTyping && (
                <div className="sticky bottom-0 pb-2">
                    <TypingIndicator />
                </div>
            )}

            <div ref={bottomRef} />
        </div>
    );
};
