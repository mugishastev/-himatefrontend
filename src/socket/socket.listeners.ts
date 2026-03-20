import { socketService } from './socket';
import { SOCKET_EVENTS } from './socket.events';
import { useMessageStore } from '../store/message.store';
import { useConversationStore } from '../store/conversation.store';
import { useCallStore } from '../store/call.store';

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

    socketService.on(SOCKET_EVENTS.CALL_INCOMING, (data) => {
        const { startCall } = useCallStore.getState();
        // data contains callerId, type, conversationId
        // we start a call as INCOMING
        startCall({ user: { id: data.callerId, username: `User ${data.callerId}` }, userId: data.callerId }, data.type, true);
    });

    socketService.on(SOCKET_EVENTS.CALL_ACCEPTED, () => {
        const { acceptCall } = useCallStore.getState();
        acceptCall();
    });

    socketService.on(SOCKET_EVENTS.CALL_ENDED, () => {
        const { endCall } = useCallStore.getState();
        endCall();
    });
};
