import { useEffect } from 'react';
import { socketService } from '../socket';
import { useConversationStore } from '../store/conversation.store';
import { SOCKET_EVENTS } from '../socket/socket.events';

export const useTypingIndicator = (conversationId: string | number | null) => {
    const { addTypingUser, removeTypingUser } = useConversationStore();

    useEffect(() => {
        if (!conversationId) return;

        const handleTyping = (data: { conversationId: string | number; userId: string | number; isTyping: boolean }) => {
            if (Number(data.conversationId) === Number(conversationId)) {
                if (data.isTyping) addTypingUser(conversationId, data.userId);
                else removeTypingUser(conversationId, data.userId);
            }
        };

        socketService.on(SOCKET_EVENTS.USER_TYPING, handleTyping);

        return () => {
            socketService.off(SOCKET_EVENTS.USER_TYPING, handleTyping);
        };
    }, [conversationId, addTypingUser, removeTypingUser]);

    return {};
};
