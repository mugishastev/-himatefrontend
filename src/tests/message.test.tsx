import { render, screen } from '@testing-library/react';
import { MessageItem } from '../features/messages/components/MessageItem';
import type { Message } from '../types/message.types';

const mockMessage: Message = {
    id: 'm1',
    content: 'Test Message Content',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    senderId: 'u1',
    conversationId: 'c1',
    type: 'TEXT',
    isRead: false,
    status: 'SENT',
    sender: {
        id: 'u1',
        username: 'John Doe',
        email: 'john@example.com',
        avatarUrl: '',
        createdAt: '',
        updatedAt: ''
    }
};

describe('Message Feature', () => {
    it('renders message item for sender', () => {
        render(<MessageItem message={mockMessage} />);
        expect(screen.getByText(/Test Message Content/i)).toBeInTheDocument();
    });
});
