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

    const createConversation = async (participantIds: (string | number)[]) => {
        if (!user?.id) {
            console.error('CreateConversation failed: Current user has no ID', user);
            return;
        }

        // Convert to numbers as required by backend CreateConversationDto
        const numericIds = [
            ...participantIds.map(id => Number(id)),
            Number(user.id)
        ].filter(id => {
            const isValid = !isNaN(id);
            if (!isValid) console.warn('Filtering out invalid userId:', id);
            return isValid;
        });

        const uniqueUserIds = Array.from(new Set(numericIds));
        console.log('Final participant IDs for creation:', uniqueUserIds);

        setIsLoading(true);
        try {
            const response = await conversationsApi.createConversation(uniqueUserIds);
            console.log('Conversation created successfully:', response);
            await fetchConversations();
            return response.data || response;
        } catch (error: any) {
            console.error('CRITICAL: createConversation failed!', error);
            if (error.response) {
                console.error('Response Status:', error.response.status);
                console.error('Response Data:', error.response.data);
            }
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
