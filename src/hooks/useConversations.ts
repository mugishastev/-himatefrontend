import { useCallback, useState } from 'react';
import { conversationsApi } from '../api/conversations.api';
import { useConversationStore } from '../store/conversation.store';
import { useAuthStore } from '../store/auth.store';

export const useConversations = () => {
    // Use granular selectors to get STABLE references — prevents infinite re-render loops
    const userId = useAuthStore((s) => s.user?.id);
    const conversations = useConversationStore((s) => s.conversations);
    const activeConversationId = useConversationStore((s) => s.activeConversationId);
    const setConversations = useConversationStore((s) => s.setConversations);
    const setActiveConversation = useConversationStore((s) => s.setActiveConversation);
    const [isLoading, setIsLoading] = useState(false);

    const fetchConversations = useCallback(async () => {
        if (!userId) return;
        setIsLoading(true);
        try {
            const response = await conversationsApi.getConversations(Number(userId));
            setConversations(response.data || response);
        } catch (error) {
            console.error('Failed to fetch conversations', error);
        } finally {
            setIsLoading(false);
        }
    }, [userId, setConversations]);

    const createConversation = async (participantIds: (string | number)[], title?: string) => {
        if (!userId) {
            console.error('CreateConversation failed: Current user has no ID');
            return;
        }

        const numericIds = [...participantIds.map((id) => Number(id))].filter((id) => !isNaN(id));
        const uniqueUserIds = Array.from(new Set(numericIds));
        const isGroup = uniqueUserIds.length > 1;

        setIsLoading(true);
        try {
            const response = await conversationsApi.createConversation({
                userIds: [...uniqueUserIds, Number(userId)],
                title,
                isGroup,
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
