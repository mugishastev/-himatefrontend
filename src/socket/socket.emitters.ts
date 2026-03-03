import { socketService } from './socket';
import { SOCKET_EVENTS } from './socket.events';

export const socketEmitters = {
    joinConversation: (conversationId: string | number) => {
        socketService.emit(SOCKET_EVENTS.JOIN_ROOM, conversationId);
    },
    leaveConversation: (conversationId: string | number) => {
        socketService.emit(SOCKET_EVENTS.LEAVE_ROOM, conversationId);
    },
    sendTyping: (conversationId: string | number, isTyping: boolean) => {
        socketService.emit(SOCKET_EVENTS.TYPING, { conversationId: Number(conversationId), isTyping });
    },
    initiateCall: (receiverId: string | number, type: 'AUDIO' | 'VIDEO', conversationId: string | number) => {
        socketService.emit(SOCKET_EVENTS.CALL_INITIATE, {
            receiverId: Number(receiverId),
            type,
            conversationId: Number(conversationId),
        });
    },
};
