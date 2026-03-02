import type { User } from './auth.types';
import type { BaseEntity } from './common.types';

export type MessageType = 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM';

export type MessageStatus = 'SENDING' | 'SENT' | 'RECEIVED' | 'READ' | 'FAILED';

export interface Message extends BaseEntity {
    content: string;
    type: MessageType;
    senderId: string;
    sender: User;
    conversationId: string;
    isRead: boolean;
    status: MessageStatus;
    fileUrl?: string;
}

export interface SendMessageDto {
    content: string;
    conversationId: string;
    type?: MessageType;
}
