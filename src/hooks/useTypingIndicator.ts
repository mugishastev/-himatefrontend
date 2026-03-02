import { useEffect } from 'react';
import { socketService } from '../socket';
import { useConversationStore } from '../store/conversation.store';

export const useTypingIndicator = (conversationId: string | null) => {
    const { addTypingUser, removeTypingUser } = useConversationStore();

    useEffect(() => {
        if (!conversationId) return;

        const handleStart = (data: { conversationId: string; userId: string }) => {
            if (data.conversationId === conversationId) {
                addTypingUser(conversationId, data.userId);
            }
        };

        const handleStop = (data: { conversationId: string; userId: string }) => {
            if (data.conversationId === conversationId) {
                removeTypingUser(conversationId, data.userId);
            }
        };

        socketService.on('typing:start', handleStart);
        socketService.on('typing:stop', handleStop);

        return () => {
            socketService.off('typing:start');
            socketService.off('typing:stop');
        };
    }, [conversationId, addTypingUser, removeTypingUser]);

    return {};
};
