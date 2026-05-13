import React from 'react';
import { ChatWindow } from '../components/ChatWindow';

export const ChatPage: React.FC = () => {
    return (
        <div className="h-full flex flex-col bg-[#111b21]">
            <ChatWindow />
        </div>
    );
};

export default ChatPage;
