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

    socketService.on(SOCKET_EVENTS.TYPING_START, ({ conversationId, userId }) => {
        const { setTyping } = useConversationStore.getState();
        setTyping(conversationId, userId, true);
    });

    socketService.on(SOCKET_EVENTS.TYPING_STOP, ({ conversationId, userId }) => {
        const { setTyping } = useConversationStore.getState();
        setTyping(conversationId, userId, false);
    });

    socketService.on(SOCKET_EVENTS.USER_ONLINE, (userId) => {
        // Handle user online status
    });
};
