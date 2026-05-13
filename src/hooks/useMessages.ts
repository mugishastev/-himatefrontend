import { useCallback, useState } from 'react';
import { messagesApi } from '../api/messages.api';
import { useMessageStore } from '../store/message.store';
import { useConversationStore } from '../store/conversation.store';
import { useAuthStore } from '../store/auth.store';

const EMPTY_ARRAY: any[] = [];

export const useMessages = () => {
    // Use granular selectors to get STABLE references — prevents infinite re-render loops
    const activeConversationId = useConversationStore((s) => s.activeConversationId);
    const updateConversationLastMessage = useConversationStore((s) => s.updateConversationLastMessage);
    const userId = useAuthStore((s) => s.user?.id);
    const messages = useMessageStore((s) => s.messages);
    const setMessages = useMessageStore((s) => s.setMessages);
    const addMessage = useMessageStore((s) => s.addMessage);
    const removeMessage = useMessageStore((s) => s.removeMessage);
    const updateMessageInStore = useMessageStore((s) => s.updateMessage);
    const setLoading = useMessageStore((s) => s.setLoading);
    const [error, setError] = useState<string | null>(null);

    const fetchMessages = useCallback(async (conversationId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await messagesApi.getMessages(conversationId);
            const items = (response.data || response) as any[];
            const normalized = [...items].sort((a, b) => {
                const aTime = new Date(a.createdAt || a.timestamp || 0).getTime();
                const bTime = new Date(b.createdAt || b.timestamp || 0).getTime();
                return aTime - bTime;
            });
            setMessages(conversationId, normalized);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch messages');
        } finally {
            setLoading(false);
        }
    }, [setMessages, setLoading]);

    const sendMessage = async (content: string, file?: File | null) => {
        if (!activeConversationId || !userId) return;
        try {
            let data: any;
            const senderId = Number(userId);
            const conversationId = Number(activeConversationId);

            if (file) {
                const formData = new FormData();
                formData.append('content', content);
                formData.append('conversationId', String(conversationId));
                formData.append('senderId', String(senderId));
                formData.append('media', file);
                data = formData;
            } else {
                data = {
                    content,
                    conversationId,
                    senderId,
                };
            }

            const response = await messagesApi.sendMessage(data);
            addMessage(response);
            updateConversationLastMessage(conversationId, response);
        } catch (err: any) {
            setError(err.message || 'Failed to send message');
        }
    };

    const deleteMessage = async (id: number) => {
        if (!activeConversationId) return;
        try {
            await messagesApi.deleteMessage(id);
            removeMessage(String(activeConversationId), id);
        } catch (err: any) {
            setError(err.message || 'Failed to delete message');
        }
    };

    const updateMessage = async (id: number, content: string) => {
        if (!activeConversationId) return;
        try {
            const updated = await messagesApi.updateMessage(id, content);
            updateMessageInStore(String(activeConversationId), updated);
        } catch (err: any) {
            setError(err.message || 'Failed to update message');
        }
    };

    return {
        messages: activeConversationId ? messages[String(activeConversationId)] || EMPTY_ARRAY : EMPTY_ARRAY,
        fetchMessages,
        sendMessage,
        deleteMessage,
        updateMessage,
        error,
    };
};
