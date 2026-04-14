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

    const createConversation = async (participantIds: (string | number)[], title?: string) => {
        if (!user?.id) {
            console.error('CreateConversation failed: Current user has no ID', user);
            return;
        }

        // Convert to numbers as required by backend CreateConversationDto
        const numericIds = [
            ...participantIds.map(id => Number(id)),
        ].filter(id => !isNaN(id));

        const uniqueUserIds = Array.from(new Set(numericIds));
        const isGroup = uniqueUserIds.length > 1; // It's a group if more than 1 other participant is added

        setIsLoading(true);
        try {
            const response = await conversationsApi.createConversation({
                userIds: [...uniqueUserIds, Number(user.id)],
                title,
                isGroup
            });
            await fetchConversations();
            return response.data || response;
        } catch (error: any) {
            console.error('CRITICAL: createConversation failed!', error);
            throw error;
        } finally {
            setIsLoading(false);
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
