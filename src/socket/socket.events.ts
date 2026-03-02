export const SOCKET_EVENTS = {
    // Connection
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    CONNECT_ERROR: 'connect_error',

    // Messages
    NEW_MESSAGE: 'message:new',
    MESSAGE_RECEIVED: 'message:received',
    MESSAGE_READ: 'message:read',
    MESSAGE_DELETED: 'message:deleted',

    // Conversations
    CONVERSATION_CREATED: 'conversation:created',
    CONVERSATION_UPDATED: 'conversation:updated',
    JOIN_ROOM: 'room:join',
    LEAVE_ROOM: 'room:leave',

    // Presence & Typing
    USER_ONLINE: 'user:online',
    USER_OFFLINE: 'user:offline',
    TYPING_START: 'typing:start',
    TYPING_STOP: 'typing:stop',
};
