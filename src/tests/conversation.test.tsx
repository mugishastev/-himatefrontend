import { render, screen } from '@testing-library/react';
import { ConversationItem } from '../features/conversations/components/ConversationItem';
import type { Conversation } from '../types/conversation.types';

const mockConversation: Conversation = {
    id: '1',
    title: 'Test Group',
    isGroup: true,
    lastMessage: {
        id: 'm1',
        content: 'Hello World',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        senderId: 'u1',
        conversationId: '1',
        type: 'TEXT',
        isRead: true,
        isDelivered: true,
        status: 'SENT',
        sender: { id: 'u1', username: 'sender', email: 's@e.com', createdAt: '', updatedAt: '' }
    },
    participants: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

describe('Conversation Feature', () => {
    it('renders conversation item correctly', () => {
        render(<ConversationItem conversation={mockConversation} />);
        expect(screen.getByText(/Test Group/i)).toBeInTheDocument();
        expect(screen.getByText(/Hello World/i)).toBeInTheDocument();
    });
});
