export const SOCKET_EVENTS = {
    // Connection
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    CONNECT_ERROR: 'connect_error',

    // Messages
    NEW_MESSAGE: 'newMessage',
    MESSAGE_RECEIVED: 'messageStatusUpdate',
    MESSAGE_READ: 'messageStatusUpdate',
    MESSAGE_DELETED: 'messageDeleted',

    // Conversations
    CONVERSATION_CREATED: 'conversationCreated',
    CONVERSATION_UPDATED: 'conversationUpdated',
    JOIN_ROOM: 'joinConversation',
    LEAVE_ROOM: 'leaveConversation',

    // Presence & Typing
    PRESENCE: 'presence',
    TYPING: 'typing',
    USER_TYPING: 'userTyping',

    // Calls
    CALL_INITIATE: 'initiateCall',
    CALL_INCOMING: 'incomingCall',
};
