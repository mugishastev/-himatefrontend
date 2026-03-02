import type { User } from './auth.types';
import type { BaseEntity } from './common.types';
import type { Message } from './message.types';

export interface Participant extends BaseEntity {
    userId: string;
    conversationId: string;
    user: User;
    isAdmin: boolean;
}

export interface Conversation extends BaseEntity {
    title?: string;
    isGroup: boolean;
    participants: Participant[];
    lastMessageId?: string;
    lastMessage?: Message;
}
