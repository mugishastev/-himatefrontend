import React, { useState, useEffect } from 'react';
import { callsApi } from '../../../api/calls.api';
import { useAuthStore } from '../../../store/auth.store';
import { useCallStore } from '../../../store/call.store';
import { UserAvatar } from '../../users/components/UserAvatar';
import { socketEmitters } from '../../../socket/socket.emitters';

export const CallsView: React.FC = () => {
    const [copied, setCopied] = useState(false);
    const [calls, setCalls] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuthStore();
    const { startCall } = useCallStore();

    useEffect(() => {
        const fetchCalls = async () => {
            if (!user?.id) return;
            try {
                const response = await callsApi.getCalls(Number(user.id));
                // response is { data: [...], total, page, limit }
                setCalls(response.data || []);
            } catch (err) {
                console.error("Failed to fetch calls:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCalls();
    }, [user?.id]);

    const handleCreateLink = () => {
        const callId = Math.random().toString(36).substring(2, 12);
        const url = `${window.location.origin}/call/${callId}`;

        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        });
    };

    const handleCallAgain = async (call: any) => {
        const participantId = call.callerId === Number(user?.id) ? call.receiverId : call.callerId;
        const participantUser = call.callerId === Number(user?.id) ? call.receiver : call.caller;
        const callType = call.type || 'AUDIO';
        
        try {
            await callsApi.createCall({
                callerId: Number(user?.id),
                receiverId: Number(participantId),
                startedAt: new Date().toISOString(),
                type: callType
            });
            
            // Emit via WebSocket
            socketEmitters.initiateCall(participantId, callType, 0); // conversationId is 0 or ignored
            
            // Start local UI
            startCall({ user: participantUser, userId: participantId }, callType);
        } catch (err) {
            console.error('Failed to replay call', err);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#111827] w-full text-[#d1d7db]">
            {/* Header */}
            <header className="h-[60px] flex items-center justify-between px-4 shrink-0 mt-2">
                <h1 className="text-[22px] font-bold text-white">Calls</h1>
                <div className="flex items-center gap-3 text-[#aebac1]">
                    <button className="p-2 hover:bg-white/5 rounded-full transition-colors group" title="New call">
                        <svg className="w-5 h-5 text-[#aebac1] group-hover:text-[#d1d7db]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* Search Bar */}
            <div className="px-3 py-2 flex items-center gap-2 shrink-0">
                <div className="flex-1 relative bg-[#1F2937] rounded-lg h-9">
                    <input
                        type="text"
                        placeholder="Search name or number"
                        className="w-full h-full bg-transparent pl-12 pr-4 text-[14px] text-white outline-none placeholder:text-[#aebac1]"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#aebac1]">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-4 block">
                <div className="pt-2">
                    <h3 className="text-[#aebac1] font-medium px-4 mb-2 text-[14px]">Favourites</h3>
                    {/* Start call button */}
                    <div
                        onClick={handleCreateLink}
                        className="flex items-center px-4 py-2.5 hover:bg-[#1F2937]/50 cursor-pointer transition-colors group/item relative"
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${copied ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#00a884] text-white'}`}>
                            {copied ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                            )}
                        </div>
                        <div className="ml-3 flex-1 min-w-0 py-1">
                            <h2 className="text-[17px] font-medium text-white truncate break-all leading-tight">Create call link</h2>
                            <p className="text-[13px] text-[#aebac1] truncate">Share a link for your Himate call</p>
                        </div>
                        {copied && (
                            <div className="absolute right-4 bg-[#202c33] border border-[#313d45] text-[#d1d7db] text-xs py-1.5 px-3 rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-2 z-10">
                                Link copied!
                            </div>
                        )}
                    </div>
                    {/* View all text */}
                    <div className="px-4 py-3">
                        <button className="text-[#00a884] text-[14px] hover:underline">View all</button>
                    </div>
                </div>

                <div className="pt-2 border-t border-[#1F2937]/50 mt-2">
                    <h3 className="text-[#aebac1] font-medium px-4 mb-2 text-[14px]">Recent</h3>

                    {isLoading ? (
                        <div className="flex justify-center p-4">
                            <div className="w-6 h-6 border-2 border-t-transparent border-[#00a884] rounded-full animate-spin"></div>
                        </div>
                    ) : calls.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center py-16 px-4">
                            <div className="w-20 h-20 bg-[#1F2937] rounded-full flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-[#aebac1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-medium text-[#d1d7db] mb-2">No recent calls</h2>
                            <p className="text-[14px] text-[#aebac1] max-w-[300px]">
                                Your most recent calls will show up here.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {calls.map((call) => {
                                const isOutgoing = call.callerId === Number(user?.id);
                                const otherUser = isOutgoing ? call.receiver : call.caller;
                                const isVideo = call.type === 'VIDEO';
                                // In a real app we'd differentiate missed vs answered. 
                                // For now, if no endedAt and not currently active, it might be missed or ongoing.
                                const isMissed = isOutgoing ? false : !call.endedAt; 

                                return (
                                    <div 
                                        key={call.id}
                                        className="flex items-center px-4 py-3 hover:bg-[#1F2937]/50 cursor-pointer transition-colors"
                                        onClick={() => handleCallAgain(call)}
                                    >
                                        <div className="mr-3 shrink-0 relative">
                                            <UserAvatar user={otherUser} size="md" />
                                        </div>
                                        <div className="flex-1 min-w-0 pr-4">
                                            <h4 className={`text-[16px] truncate ${isMissed ? 'text-red-500' : 'text-[#d1d7db]'}`}>
                                                {otherUser?.username || 'Unknown User'}
                                            </h4>
                                            <div className="flex items-center text-[13px] text-[#aebac1] mt-0.5 space-x-1">
                                                {isOutgoing ? (
                                                    <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                                                ) : (
                                                    <svg className={`w-3.5 h-3.5 ${isMissed ? 'text-red-500' : 'text-emerald-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                                                )}
                                                <span>{new Date(call.startedAt).toLocaleDateString()} at {new Date(call.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                        <div className="shrink-0 text-[#aebac1]">
                                            {isVideo ? (
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
