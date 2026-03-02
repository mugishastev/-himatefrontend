import React from 'react';
import type { User } from '../../../types/user.types';
import { UserAvatar } from '../../users/components/UserAvatar';

interface ContactItemProps {
    contact: User;
}

export const ContactItem: React.FC<ContactItemProps> = ({ contact }) => {
    return (
        <div className="flex items-center p-4 hover:bg-bg-secondary transition-colors cursor-pointer group">
            <UserAvatar user={contact} size="sm" />
            <div className="ml-4 flex-1">
                <h4 className="text-sm font-semibold text-text-primary group-hover:text-brand transition-colors">
                    {contact.username}
                </h4>
                <p className="text-xs text-text-secondary">
                    {contact.status || 'No status'}
                </p>
            </div>
            <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity text-brand hover:bg-brand/10 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            </button>
        </div>
    );
};
