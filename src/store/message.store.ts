import { create } from 'zustand';
import type { Message } from '../types/message.types';

interface MessageState {
    messages: Record<string, Message[]>; // conversationId -> messages
    isLoading: boolean;
    setMessages: (conversationId: string, messages: Message[]) => void;
    addMessage: (message: Message) => void;
    removeMessage: (conversationId: string, messageId: number) => void;
    updateMessage: (conversationId: string, message: Message) => void;
    setLoading: (isLoading: boolean) => void;
}

export const useMessageStore = create<MessageState>((set) => ({
    messages: {},
    isLoading: false,
    setMessages: (conversationId, messages) =>
        set((state) => ({
            messages: { ...state.messages, [String(conversationId)]: messages },
        })),
    addMessage: (message) =>
        set((state) => {
            const key = String(message.conversationId);
            const currentMessages = state.messages[key] || [];
            if (currentMessages.some((m) => m.id === message.id)) return state;

            return {
                messages: {
                    ...state.messages,
                    [key]: [...currentMessages, message],
                },
            };
        }),
    removeMessage: (conversationId, messageId) =>
        set((state) => {
            const key = String(conversationId);
            const currentMessages = state.messages[key] || [];
            return {
                messages: {
                    ...state.messages,
                    [key]: currentMessages.filter((m) => m.id !== messageId),
                },
            };
        }),
    updateMessage: (conversationId, message) =>
        set((state) => {
            const key = String(conversationId);
            const currentMessages = state.messages[key] || [];
            return {
                messages: {
                    ...state.messages,
                    [key]: currentMessages.map((m) => (m.id === message.id ? message : m)),
                },
            };
        }),
    setLoading: (isLoading) => set({ isLoading }),
}));
