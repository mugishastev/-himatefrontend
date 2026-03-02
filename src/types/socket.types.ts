import { Message } from './message.types';
import { Conversation } from './conversation.types';

export interface ServerToClientEvents {
    'message:new': (message: Message) => void;
    'message:received': (data: { messageId: string; receiverId: string }) => void;
    'message:read': (data: { messageId: string; readerId: string }) => void;
    'conversation:created': (conversation: Conversation) => void;
    'user:online': (userId: string) => void;
    'user:offline': (userId: string) => void;
    'typing:start': (data: { conversationId: string; userId: string }) => void;
    'typing:stop': (data: { conversationId: string; userId: string }) => void;
}

export interface ClientToServerEvents {
    'room:join': (conversationId: string) => void;
    'room:leave': (conversationId: string) => void;
    'typing:start': (data: { conversationId: string }) => void;
    'typing:stop': (data: { conversationId: string }) => void;
}
