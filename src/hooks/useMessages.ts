import { useCallback, useState } from 'react';
import { messagesApi } from '../api/messages.api';
import { useMessageStore } from '../store/message.store';
import { useConversationStore } from '../store/conversation.store';

export const useMessages = () => {
    const { activeConversationId } = useConversationStore();
    const { messages, setMessages, addMessage, setLoading } = useMessageStore();
    const [error, setError] = useState<string | null>(null);

    const fetchMessages = useCallback(async (conversationId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await messagesApi.getMessages(conversationId);
            setMessages(conversationId, response.data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch messages');
        } finally {
            setLoading(false);
        }
    }, [setMessages, setLoading]);

    const sendMessage = async (content: string, file?: File | null) => {
        if (!activeConversationId) return;
        try {
            let data: any;

            if (file) {
                const formData = new FormData();
                formData.append('content', content);
                formData.append('conversationId', activeConversationId);
                formData.append('type', file.type.startsWith('image/') ? 'IMAGE' : 'FILE');
                formData.append('file', file);
                data = formData;
            } else {
                data = {
                    content,
                    conversationId: activeConversationId,
                    type: 'TEXT',
                };
            }

            const response = await messagesApi.sendMessage(data);
            addMessage(response.data);
        } catch (err: any) {
            setError(err.message || 'Failed to send message');
        }
    };

    return {
        messages: activeConversationId ? messages[activeConversationId] || [] : [],
        fetchMessages,
        sendMessage,
        error,
    };
};
