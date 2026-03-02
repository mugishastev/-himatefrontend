import React from 'react';
import type { User } from '../../../types/user.types';
import { Card } from '../../../components/ui/Card';
import { UserAvatar } from './UserAvatar';
import { Button } from '../../../components/ui/Button';

interface UserCardProps {
    user: User;
    onMessage?: () => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onMessage }) => {
    return (
        <Card className="p-4 flex flex-col items-center text-center space-y-4">
            <UserAvatar user={user} size="lg" />
            <div>
                <h3 className="text-lg font-bold text-text-primary">{user.username}</h3>
                <p className="text-sm text-text-secondary">{user.email}</p>
            </div>
            <div className="flex w-full gap-2">
                <Button variant="primary" size="sm" className="flex-1" onClick={onMessage}>
                    Message
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                    Profile
                </Button>
            </div>
        </Card>
    );
};
