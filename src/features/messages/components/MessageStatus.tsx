import React from 'react';
import type { MessageStatus as Status } from '../../../types/message.types';

interface MessageStatusProps {
    status: Status;
}

export const MessageStatus: React.FC<MessageStatusProps> = ({ status }) => {
    switch (status) {
        case 'SENDING':
            return (
                <svg className="w-3 h-3 text-text-secondary/40 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            );
        case 'SENT':
            return (
                <svg className="w-4 h-4 text-text-secondary/60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 9.00003L10.3 16L7.5 13.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        case 'RECEIVED':
            return (
                <svg className="w-4 h-4 text-text-secondary/60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 9.00003L6 15L3 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21 9.00003L13.5 17.5L10.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        case 'READ':
            return (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 9.00003L6 15L3 12" stroke="#34B7F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21 9.00003L13.5 17.5L10.5 14.5" stroke="#34B7F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        case 'FAILED':
            return (
                <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
        default:
            return null;
    }
};
