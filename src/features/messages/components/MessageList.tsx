import React, { useEffect, useMemo, useRef } from 'react';
import { MessageItem } from './MessageItem';
import { TypingIndicator } from './TypingIndicator';
import { useMessages } from '../../../hooks/useMessages';
import { useConversationStore } from '../../../store/conversation.store';
import { useTypingIndicator } from '../../../hooks/useTypingIndicator';
import { socketEmitters } from '../../../socket';
import { formatChatDayDivider } from '../../../utils/chat';
import { messagesApi } from '../../../api/messages.api';

export const MessageList: React.FC = () => {
    const { activeConversationId, typingUsers } = useConversationStore();
    const clearUnreadCount = useConversationStore((state) => state.clearUnreadCount);
    const { messages, fetchMessages } = useMessages();
    const bottomRef = useRef<HTMLDivElement>(null);

    // Subscribe to typing events
    useTypingIndicator(activeConversationId);

    const typingKey = activeConversationId ? String(activeConversationId) : null;
    const isAnyoneTyping = typingKey ? (typingUsers[typingKey]?.length || 0) > 0 : false;
    const orderedMessages = useMemo(() => {
        return [...messages].sort((a, b) => {
            const aTime = new Date(a.createdAt || a.timestamp || 0).getTime();
            const bTime = new Date(b.createdAt || b.timestamp || 0).getTime();
            return aTime - bTime;
        });
    }, [messages]);

    useEffect(() => {
        if (activeConversationId) {
            fetchMessages(String(activeConversationId));
            socketEmitters.joinConversation(activeConversationId);

            // Instantly clear unread count in frontend state
            clearUnreadCount(activeConversationId);
            // Tell backend messages are read
            messagesApi.markConversationAsRead(activeConversationId).catch(console.error);
        }
        return () => {
            if (activeConversationId) {
                socketEmitters.leaveConversation(activeConversationId);
            }
        };
    }, [activeConversationId, fetchMessages, clearUnreadCount]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [orderedMessages.length]);

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
            {orderedMessages.map((message, index) => {
                const prev = index > 0 ? orderedMessages[index - 1] : null;
                const currentDay = formatChatDayDivider(message);
                const prevDay = prev ? formatChatDayDivider(prev) : null;
                const showDivider = !prev || currentDay !== prevDay;

                return (
                    <React.Fragment key={String(message.id)}>
                        {showDivider && (
                            <div className="flex justify-center py-1">
                                <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-text-secondary bg-white border border-gray-100 rounded-full">
                                    {currentDay}
                                </span>
                            </div>
                        )}
                        <MessageItem message={message} />
                    </React.Fragment>
                );
            })}

            {isAnyoneTyping && (
                <div className="sticky bottom-0 pb-2">
                    <TypingIndicator />
                </div>
            )}

            <div ref={bottomRef} />
        </div>
    );
};
