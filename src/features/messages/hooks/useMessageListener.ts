import { useEffect } from 'react';
import { socket } from '../../../socket';
import { useMessageStore } from '../../../store/message.store';
import { useConversationStore } from '../../../store/conversation.store';
import type { Message } from '../../../types/message.types';

export const useMessageListener = () => {
    const { addMessage } = useMessageStore();
    const { updateConversationLastMessage } = useConversationStore();

    useEffect(() => {
        const handleNewMessage = (message: Message) => {
            addMessage(message.conversationId, message);
            updateConversationLastMessage(message.conversationId, message);
        };

        socket.on('message:new', handleNewMessage);

        return () => {
            socket.off('message:new', handleNewMessage);
        };
    }, [addMessage, updateConversationLastMessage]);
};
