import React, { useEffect, useState } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useConversationStore } from '../../../store/conversation.store';
import { UserAvatar } from '../../users/components/UserAvatar';
import { useAuthStore } from '../../../store/auth.store';
import { socketEmitters, socketService, SOCKET_EVENTS } from '../../../socket';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { useToastStore } from '../../../store/toast.store';

export const ChatWindow: React.FC = () => {
    const { activeConversationId, conversations } = useConversationStore();
    const { user } = useAuthStore();
    const { addToast } = useToastStore();
    const activeConversation = conversations.find(c => c.id === activeConversationId);
    const [incomingCall, setIncomingCall] = useState<{ callerId: number; type: 'AUDIO' | 'VIDEO'; conversationId: number } | null>(null);
    const [outgoingCallType, setOutgoingCallType] = useState<'AUDIO' | 'VIDEO' | null>(null);

    const otherParticipant = activeConversation?.participants.find(
        (p) => Number(p.userId) !== Number(user?.id)
    );
    const displayName = activeConversation?.isGroup
        ? activeConversation.title
        : otherParticipant?.user.username || 'Chat';
    const subtitle = activeConversation?.isGroup
        ? `${activeConversation.participants.length} members`
        : (otherParticipant?.user?.email || 'Direct conversation');

    useEffect(() => {
        const handleIncomingCall = (payload: { callerId: number; type: 'AUDIO' | 'VIDEO'; conversationId: number }) => {
            setIncomingCall(payload);
            addToast(`${payload.type === 'VIDEO' ? 'Video' : 'Audio'} call incoming`, 'info');
        };

        socketService.on(SOCKET_EVENTS.CALL_INCOMING, handleIncomingCall);
        return () => socketService.off(SOCKET_EVENTS.CALL_INCOMING, handleIncomingCall);
    }, [addToast]);

    const handleStartCall = (type: 'AUDIO' | 'VIDEO') => {
        if (!activeConversationId || !otherParticipant?.userId) return;
        socketEmitters.initiateCall(otherParticipant.userId, type, activeConversationId);
        setOutgoingCallType(type);
        addToast(`${type === 'VIDEO' ? 'Video' : 'Audio'} call request sent`, 'success');
    };

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
                                <p className="text-[11px] font-semibold text-text-secondary mt-0.5 truncate max-w-[220px]">
                                    {subtitle}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                type="button"
                                onClick={() => handleStartCall('AUDIO')}
                                className="p-2.5 hover:bg-bg-secondary rounded-2xl text-text-secondary transition-all hover:text-brand border border-transparent hover:border-gray-100"
                                title="Start audio call"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h2l2 5-2 1a10 10 0 005 5l1-2 5 2v2a2 2 0 01-2 2h-1C8.373 18 3 12.627 3 6V5z" />
                                </svg>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleStartCall('VIDEO')}
                                className="p-2.5 hover:bg-bg-secondary rounded-2xl text-text-secondary transition-all hover:text-brand border border-transparent hover:border-gray-100"
                                title="Start video call"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14m-9 4h7a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z" />
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

            <Modal
                isOpen={!!incomingCall}
                onClose={() => setIncomingCall(null)}
                title="Incoming Call"
            >
                {incomingCall && (
                    <div className="space-y-4">
                        <p className="text-sm text-text-secondary">
                            {incomingCall.type === 'VIDEO' ? 'Video' : 'Audio'} call from user #{incomingCall.callerId}
                        </p>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => {
                                    setIncomingCall(null);
                                    addToast('Call declined', 'warning');
                                }}
                            >
                                Decline
                            </Button>
                            <Button
                                variant="primary"
                                className="flex-1"
                                onClick={() => {
                                    setIncomingCall(null);
                                    addToast('Call accepted. Media streaming setup pending.', 'info');
                                }}
                            >
                                Accept
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal
                isOpen={!!outgoingCallType}
                onClose={() => setOutgoingCallType(null)}
                title="Calling"
            >
                {outgoingCallType && (
                    <div className="space-y-4">
                        <p className="text-sm text-text-secondary">
                            {outgoingCallType === 'VIDEO' ? 'Video' : 'Audio'} calling {displayName || 'contact'}...
                        </p>
                        <Button variant="outline" className="w-full" onClick={() => setOutgoingCallType(null)}>
                            End Call Request
                        </Button>
                    </div>
                )}
            </Modal>
        </div>
    );
};
