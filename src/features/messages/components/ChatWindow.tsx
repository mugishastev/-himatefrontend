import React from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useConversationStore } from '../../../store/conversation.store';
import { UserAvatar } from '../../users/components/UserAvatar';

export const ChatWindow: React.FC = () => {
    const { activeConversationId, conversations } = useConversationStore();
    const activeConversation = conversations.find(c => c.id === activeConversationId);

    const otherParticipant = activeConversation?.participants.find(p => !p.user.isAdmin);
    const displayName = activeConversation?.isGroup
        ? activeConversation.title
        : otherParticipant?.user.username || 'Chat';

    return (
        <div className="flex-1 flex flex-col bg-bg-secondary h-full min-w-0">
            {activeConversationId ? (
                <>
                    <header className="p-4 bg-white border-b border-gray-100 flex items-center justify-between shadow-sm z-10">
                        <div className="flex items-center space-x-4">
                            {otherParticipant?.user ? (
                                <UserAvatar user={otherParticipant.user} size="md" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center font-bold text-brand shadow-sm border-2 border-white">
                                    {(displayName || 'C').charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <h3 className="font-black text-text-primary leading-tight tracking-tight text-lg">
                                    {displayName || 'Chat'}
                                </h3>
                                <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-brand mt-0.5">
                                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2 shadow-sm shadow-green-200"></span>
                                    Active Now
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                type="button"
                                className="p-2.5 hover:bg-bg-secondary rounded-2xl text-text-secondary transition-all hover:text-brand border border-transparent hover:border-gray-100"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                            <button
                                type="button"
                                className="p-2.5 hover:bg-bg-secondary rounded-2xl text-text-secondary transition-all hover:text-brand border border-transparent hover:border-gray-100"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                </svg>
                            </button>
                        </div>
                    </header>

                    <MessageList />
                    <MessageInput />
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white/50">
                    <div className="w-24 h-24 bg-brand/10 rounded-full flex items-center justify-center text-brand mb-6 animate-bounce">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.827-1.233L3 20l1.326-3.954A8.962 8.962 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-text-primary mb-2">Your Messages</h2>
                    <p className="text-text-secondary max-w-sm">
                        Select a conversation from the sidebar or start a new one to begin chatting.
                    </p>
                </div>
            )}
        </div>
    );
};
