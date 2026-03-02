import { useEffect } from 'react';
import { useConversationStore } from '../../../store/conversation.store';
import { conversationsApi } from '../../../api/conversations.api';

export const useConversationList = () => {
    const { setConversations, setLoading } = useConversationStore();

    useEffect(() => {
        const fetchConversations = async () => {
            setLoading(true);
            try {
                const response = await conversationsApi.getConversations();
                setConversations(response.data);
            } catch (error) {
                console.error('Failed to fetch conversations', error);
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, [setConversations, setLoading]);
};
