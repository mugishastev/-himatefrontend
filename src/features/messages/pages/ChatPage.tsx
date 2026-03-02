import React from 'react';
import { ChatWindow } from '../components/ChatWindow';

export const ChatPage: React.FC = () => {
    return (
        <div className="h-full flex flex-col bg-bg-secondary">
            <ChatWindow />
        </div>
    );
};

export default ChatPage;
