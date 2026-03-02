import { render, screen } from '@testing-library/react';
import { NotificationBadge } from '../features/notifications/components/NotificationBadge';
import { useNotificationStore } from '../store/notification.store';

describe('Notification Feature', () => {
    it('renders badge when there are unread notifications', () => {
        useNotificationStore.setState({ unreadCount: 5 });
        render(<NotificationBadge />);
        expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('does not render badge when unread count is zero', () => {
        useNotificationStore.setState({ unreadCount: 0 });
        const { container } = render(<NotificationBadge />);
        expect(container.firstChild).toBeNull();
    });
});
