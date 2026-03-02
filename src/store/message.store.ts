import { create } from 'zustand';
import type { Message } from '../types/message.types';

interface MessageState {
    messages: Record<string, Message[]>; // conversationId -> messages
    isLoading: boolean;
    setMessages: (conversationId: string, messages: Message[]) => void;
    addMessage: (message: Message) => void;
    setLoading: (isLoading: boolean) => void;
}

export const useMessageStore = create<MessageState>((set) => ({
    messages: {},
    isLoading: false,
    setMessages: (conversationId, messages) =>
        set((state) => ({
            messages: { ...state.messages, [conversationId]: messages },
        })),
    addMessage: (message) =>
        set((state) => {
            const currentMessages = state.messages[message.conversationId] || [];
            if (currentMessages.some((m) => m.id === message.id)) return state;

            return {
                messages: {
                    ...state.messages,
                    [message.conversationId]: [...currentMessages, message],
                },
            };
        }),
    setLoading: (isLoading) => set({ isLoading }),
}));
