import { useEffect } from 'react';
import { socketService, SOCKET_EVENTS } from '../../../socket';
import { useMessageStore } from '../../../store/message.store';
import { useConversationStore } from '../../../store/conversation.store';
import type { Message } from '../../../types/message.types';

export const useMessageListener = () => {
    const { addMessage } = useMessageStore();
    const { updateConversationLastMessage } = useConversationStore();

    useEffect(() => {
        const handleNewMessage = (message: Message) => {
            addMessage(message);
            updateConversationLastMessage(message.conversationId, message);
        };

        socketService.on(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);

        return () => {
            socketService.off(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);
        };
    }, [addMessage, updateConversationLastMessage]);
};
