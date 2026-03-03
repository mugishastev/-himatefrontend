import React from 'react';
import type { Message } from '../../../types/message.types';
import { useAuthStore } from '../../../store/auth.store';
import { MessageStatus } from './MessageStatus';
import { formatChatTime } from '../../../utils/chat';

interface MessageItemProps {
    message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
    const { user } = useAuthStore();
    const isOwn = Number(message.senderId) === Number(user?.id);
    const senderName = isOwn ? 'You' : (message.sender?.username || 'Unknown');

    return (
        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out`}>
            <div className={`flex max-w-[85%] sm:max-w-[70%] ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
                {!isOwn && (
                    <div className="w-9 h-9 rounded-2xl bg-brand/10 flex-shrink-0 flex items-center justify-center text-sm font-black text-brand overflow-hidden mb-1 shadow-sm border border-brand/5">
                        {message.sender.avatarUrl ? (
                            <img src={message.sender.avatarUrl} alt={message.sender.username} className="w-full h-full object-cover" />
                        ) : (
                            message.sender.username.charAt(0).toUpperCase()
                        )}
                    </div>
                )}

                <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                    <span className="text-[11px] font-bold text-text-secondary mb-1 px-1">{senderName}</span>
                    <div
                        className={`px-5 py-3 rounded-3xl text-sm font-medium leading-relaxed transition-all duration-300 ${isOwn
                            ? 'bg-brand text-white rounded-br-none shadow-lg shadow-brand/10 hover:shadow-brand/20'
                            : 'bg-white text-text-primary rounded-bl-none border border-gray-100 shadow-md hover:shadow-lg'
                            }`}
                    >
                        {message.content}
                        {message.mediaUrl && (
                            <a
                                href={message.mediaUrl}
                                target="_blank"
                                rel="noreferrer"
                                className={`block mt-2 text-xs underline ${isOwn ? 'text-white/90' : 'text-brand'}`}
                            >
                                Open attachment
                            </a>
                        )}
                    </div>
                    <div className="flex items-center space-x-2 mt-1.5 px-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-60">
                            {formatChatTime(message)}
                        </span>
                        {isOwn && <MessageStatus status={message.status || 'SENT'} />}
                    </div>
                </div>
            </div>
        </div>
    );
};
