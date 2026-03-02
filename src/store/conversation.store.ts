import { create } from 'zustand';
import type { Conversation } from '../types/conversation.types';
import type { Message } from '../types/message.types';

interface ConversationState {
    conversations: Conversation[];
    activeConversationId: string | null;
    typingUsers: Record<string, string[]>; // conversationId -> userIds
    setConversations: (conversations: Conversation[]) => void;
    setActiveConversation: (id: string | null) => void;
    addConversation: (conversation: Conversation) => void;
    updateConversationLastMessage: (conversationId: string, message: Message) => void;
    setTyping: (conversationId: string, userId: string, isTyping: boolean) => void;
    addTypingUser: (conversationId: string, userId: string) => void;
    removeTypingUser: (conversationId: string, userId: string) => void;
}

export const useConversationStore = create<ConversationState>((set) => ({
    conversations: [],
    activeConversationId: null,
    typingUsers: {},
    setConversations: (conversations) => set({ conversations }),
    setActiveConversation: (id) => set({ activeConversationId: id }),
    addConversation: (conversation) =>
        set((state) => ({ conversations: [conversation, ...state.conversations] })),
    updateConversationLastMessage: (conversationId, message) =>
        set((state) => ({
            conversations: state.conversations.map((c) =>
                c.id === conversationId ? { ...c, lastMessage: message } : c
            ),
        })),
    setTyping: (conversationId, userId, isTyping) =>
        set((state) => {
            const currentTyping = state.typingUsers[conversationId] || [];
            const newTyping = isTyping
                ? [...new Set([...currentTyping, userId])]
                : currentTyping.filter((id) => id !== userId);

            return {
                typingUsers: { ...state.typingUsers, [conversationId]: newTyping },
            };
        }),
    addTypingUser: (conversationId, userId) =>
        set((state) => {
            const current = state.typingUsers[conversationId] || [];
            if (current.includes(userId)) return state;
            return {
                typingUsers: {
                    ...state.typingUsers,
                    [conversationId]: [...current, userId],
                },
            };
        }),
    removeTypingUser: (conversationId, userId) =>
        set((state) => ({
            typingUsers: {
                ...state.typingUsers,
                [conversationId]: (state.typingUsers[conversationId] || []).filter(
                    (id) => id !== userId
                ),
            },
        })),
}));
