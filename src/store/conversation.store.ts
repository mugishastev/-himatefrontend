import { create } from 'zustand';
import type { Conversation } from '../types/conversation.types';
import type { Message } from '../types/message.types';

interface ConversationState {
    conversations: Conversation[];
    activeConversationId: string | number | null;
    typingUsers: Record<string, (string | number)[]>; // conversationId -> userIds
    setConversations: (conversations: Conversation[]) => void;
    setActiveConversation: (id: string | number | null) => void;
    addConversation: (conversation: Conversation) => void;
    updateConversationLastMessage: (conversationId: string | number, message: Message) => void;
    setTyping: (conversationId: string | number, userId: string | number, isTyping: boolean) => void;
    addTypingUser: (conversationId: string | number, userId: string | number) => void;
    removeTypingUser: (conversationId: string | number, userId: string | number) => void;
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
            const key = String(conversationId);
            const currentTyping = state.typingUsers[key] || [];
            const newTyping = isTyping
                ? [...new Set([...currentTyping, userId])]
                : currentTyping.filter((id) => id !== userId);

            return {
                typingUsers: { ...state.typingUsers, [key]: newTyping },
            };
        }),
    addTypingUser: (conversationId, userId) =>
        set((state) => {
            const key = String(conversationId);
            const current = state.typingUsers[key] || [];
            if (current.includes(userId)) return state;
            return {
                typingUsers: {
                    ...state.typingUsers,
                    [key]: [...current, userId],
                },
            };
        }),
    removeTypingUser: (conversationId, userId) =>
        set((state) => {
            const key = String(conversationId);
            return {
                typingUsers: {
                    ...state.typingUsers,
                    [key]: (state.typingUsers[key] || []).filter((id) => id !== userId),
                },
            };
        }),
}));
