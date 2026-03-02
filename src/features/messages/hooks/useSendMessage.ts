import { useState } from 'react';
import { messagesApi } from '../../../api/messages.api';
import { useMessageStore } from '../../../store/message.store';
import { useConversationStore } from '../../../store/conversation.store';
import { useAuthStore } from '../../../store/auth.store';

export const useSendMessage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { addMessage } = useMessageStore();
    const { updateConversationLastMessage } = useConversationStore();
    const { user } = useAuthStore();

    const sendMessage = async (conversationId: string, content: string) => {
        if (!user) return;
        setIsLoading(true);
        try {
            const response = await messagesApi.sendMessage({ conversationId, content });
            addMessage(conversationId, response.data);
            updateConversationLastMessage(conversationId, response.data);
            return response.data;
        } catch (error) {
            console.error('Failed to send message', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return { sendMessage, isLoading };
};
