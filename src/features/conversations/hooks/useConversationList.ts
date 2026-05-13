import { useEffect } from 'react';
import { useConversationStore } from '../../../store/conversation.store';
import { conversationsApi } from '../../../api/conversations.api';

export const useConversationList = () => {
    const setConversations = useConversationStore((s) => s.setConversations);
    const setLoading = useConversationStore((s) => s.setLoading);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};
