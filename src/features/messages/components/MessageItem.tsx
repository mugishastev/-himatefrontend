import React, { useState, useRef, useEffect } from 'react';
import type { Message } from '../../../types/message.types';
import { useAuthStore } from '../../../store/auth.store';
import { MessageStatus } from './MessageStatus';
import { VoiceNote } from './VoiceNote';
import { formatChatTime } from '../../../utils/chat';
import { useMessages } from '../../../hooks/useMessages';
import { useConversationStore } from '../../../store/conversation.store';

interface MessageItemProps {
    message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
    const { user } = useAuthStore();
    const { deleteMessage } = useMessages();
    const { setEditingMessage } = useConversationStore();
    const isOwn = Number(message.senderId) === Number(user?.id);
    const [showOptions, setShowOptions] = useState(false);
    const optionsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
                setShowOptions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDelete = async () => {
        if (window.confirm('Delete this message?')) {
            await deleteMessage(Number(message.id));
            setShowOptions(false);
        }
    };

    const handleEdit = () => {
        setEditingMessage(message);
        setShowOptions(false);
    };

    return (
        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group mb-1.5 px-4 sm:px-12 relative`}>
            <div className={`flex ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-end gap-1`}>
                {!isOwn && (
                    <div className="w-8 h-8 rounded-full bg-brand/5 flex-shrink-0 flex items-center justify-center text-xs font-black text-brand overflow-hidden mb-1 shadow-sm border border-brand/10">
                        {message.sender.avatarUrl ? (
                            <img src={message.sender.avatarUrl} alt={message.sender.username} className="w-full h-full object-cover" />
                        ) : (
                            message.sender.username.charAt(0).toUpperCase()
                        )}
                    </div>
                )}

                <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} relative group/msg max-w-[85%] sm:max-w-[70%]`}>
                    <div
                        className={`relative px-3 py-1.5 rounded-lg text-[14.2px] leading-relaxed shadow-sm transition-all duration-300 ${isOwn
                            ? 'bg-[#dcf8c6] text-[#111b21] rounded-tr-none'
                            : 'bg-white text-[#111b21] rounded-tl-none border border-[#d1d7db]/30'
                            }`}
                    >
                        {/* Tail Component */}
                        <div className={`absolute top-0 w-3 h-3 overflow-hidden ${isOwn ? '-right-2' : '-left-2'}`}>
                            <div className={`w-3 h-3 origin-center rotate-45 transform ${isOwn ? 'bg-[#dcf8c6]' : 'bg-white border-l border-t border-[#d1d7db]/30'} ${isOwn ? '-translate-x-1.5 shadow-[-1px_1px_1px_rgba(0,0,0,0.05)]' : 'translate-x-1.5 shadow-[-1px_1px_1px_rgba(0,0,0,0.03)]'}`}></div>
                        </div>

                        {message.content}

                        {message.mediaUrl && (
                            <div className="mt-1.5 rounded-md overflow-hidden bg-black/5">
                                {message.type === 'IMAGE' && (
                                    <div className="relative group cursor-pointer overflow-hidden max-w-full">
                                        <img
                                            src={message.mediaUrl}
                                            alt="Shared"
                                            className="w-full h-auto object-cover max-h-[350px]"
                                        />
                                    </div>
                                )}
                                {message.type === 'VIDEO' && (
                                    <video controls className="w-full max-h-[300px]">
                                        <source src={message.mediaUrl} type="video/mp4" />
                                    </video>
                                )}
                                {message.type === 'AUDIO' && (
                                    <VoiceNote audioUrl={message.mediaUrl} isOwn={isOwn} />
                                )}
                            </div>
                        )}

                        <div className="flex items-center justify-end gap-1 mt-1 -mr-0.5 ml-4 float-right h-4">
                            <span className="text-[11px] text-[#667781] font-normal lowercase">
                                {formatChatTime(message)}
                                {message.createdAt !== message.updatedAt && ' (edited)'}
                            </span>
                            {isOwn && <MessageStatus status={message.status || (message.isRead ? 'READ' : (message.isDelivered ? 'RECEIVED' : 'SENT'))} />}
                        </div>
                    </div>

                    {isOwn && (
                        <div className="absolute top-0 -left-10 opacity-0 group-hover/msg:opacity-100 transition-opacity z-10" ref={optionsRef}>
                            <button
                                onClick={() => setShowOptions(!showOptions)}
                                className="p-2 hover:bg-black/5 rounded-full text-gray-500"
                            >
                                <svg className="w-5 h-5 font-bold" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                </svg>
                            </button>
                            {showOptions && (
                                <div className="absolute top-10 left-0 bg-white border border-gray-200 rounded shadow-xl py-1 w-32 z-50">
                                    <button onClick={handleEdit} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">Edit</button>
                                    <button onClick={handleDelete} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">Delete</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
