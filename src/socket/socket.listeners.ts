import { socketService } from './socket';
import { SOCKET_EVENTS } from './socket.events';
import { useMessageStore } from '../store/message.store';
import { useConversationStore } from '../store/conversation.store';

export const setupSocketListeners = () => {
    socketService.on(SOCKET_EVENTS.NEW_MESSAGE, (message) => {
        const { addMessage } = useMessageStore.getState();
        const { updateConversationLastMessage } = useConversationStore.getState();

        addMessage(message);
        updateConversationLastMessage(message.conversationId, message);
    });

    socketService.on(SOCKET_EVENTS.USER_TYPING, ({ conversationId, userId, isTyping }) => {
        const { setTyping } = useConversationStore.getState();
        setTyping(conversationId, userId, !!isTyping);
    });
};
