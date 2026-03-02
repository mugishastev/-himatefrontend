import { BaseEntity } from './common.types';

export type NotificationType = 'MESSAGE' | 'FRIEND_REQUEST' | 'SYSTEM';

export interface Notification extends BaseEntity {
    type: NotificationType;
    content: string;
    isRead: boolean;
    userId: string;
    relatedId?: string; // e.g. messageId or conversationId
}
