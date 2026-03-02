import { socketService } from './socket';
import { SOCKET_EVENTS } from './socket.events';

export const socketEmitters = {
    joinConversation: (conversationId: string) => {
        socketService.emit(SOCKET_EVENTS.JOIN_ROOM, conversationId);
    },
    leaveConversation: (conversationId: string) => {
        socketService.emit(SOCKET_EVENTS.LEAVE_ROOM, conversationId);
    },
    sendTypingStart: (conversationId: string) => {
        socketService.emit(SOCKET_EVENTS.TYPING_START, { conversationId });
    },
    sendTypingStop: (conversationId: string) => {
        socketService.emit(SOCKET_EVENTS.TYPING_STOP, { conversationId });
    },
};
