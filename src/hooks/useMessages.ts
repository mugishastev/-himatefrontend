import { useCallback, useState } from 'react';
import { messagesApi } from '../api/messages.api';
import { useMessageStore } from '../store/message.store';
import { useConversationStore } from '../store/conversation.store';
import { useAuthStore } from '../store/auth.store';

export const useMessages = () => {
    const { activeConversationId, updateConversationLastMessage } = useConversationStore();
    const { user } = useAuthStore();
    const { messages, setMessages, addMessage, removeMessage, updateMessage: updateMessageInStore, setLoading } = useMessageStore();
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
        if (!activeConversationId || !user?.id) return;
        try {
            let data: any;
            const senderId = Number(user.id);
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
        messages: activeConversationId ? messages[String(activeConversationId)] || [] : [],
        fetchMessages,
        sendMessage,
        deleteMessage,
        updateMessage,
        error,
    };
};
