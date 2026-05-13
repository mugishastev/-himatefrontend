import React from 'react';
import { ConversationList } from '../components/ConversationList';

export const ConversationsPage: React.FC = () => {
    return (
        <div className="h-full flex flex-col bg-[#111b21]">
            <ConversationList />
        </div>
    );
};

export default ConversationsPage;
