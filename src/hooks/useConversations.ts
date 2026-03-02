import { useCallback, useState } from 'react';
import { conversationsApi } from '../api/conversations.api';
import { useConversationStore } from '../store/conversation.store';
import { useAuthStore } from '../store/auth.store';

export const useConversations = () => {
    const { user } = useAuthStore();
    const { conversations, setConversations, setActiveConversation, activeConversationId } = useConversationStore();
    const [isLoading, setIsLoading] = useState(false);

    const fetchConversations = useCallback(async () => {
        if (!user?.id) return;
        setIsLoading(true);
        try {
            // Convert userId to number if necessary, as the API expects number or backend handles string
            const response = await conversationsApi.getConversations(Number(user.id));
            // Ensure we're setting the array of conversations
            setConversations(response.data || response);
        } catch (error) {
            console.error('Failed to fetch conversations', error);
        } finally {
            setIsLoading(false);
        }
    }, [setConversations, user?.id]);

    const createConversation = async (participantIds: string[]) => {
        try {
            const response = await conversationsApi.createConversation(participantIds);
            fetchConversations();
            return response.data;
        } catch (error) {
            console.error('Failed to create conversation', error);
        }
    };

    return {
        conversations,
        activeConversationId,
        fetchConversations,
        createConversation,
        setActiveConversation,
        isLoading,
    };
};
