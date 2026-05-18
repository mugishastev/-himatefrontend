import React, { useState, useEffect } from 'react';
import { callsApi } from '../../../api/calls.api';
import { useAuthStore } from '../../../store/auth.store';
import { useCallStore } from '../../../store/call.store';
import { UserAvatar } from '../../users/components/UserAvatar';
import { socketEmitters } from '../../../socket/socket.emitters';
import { Video, Link as LinkIcon, Plus, Calendar, Keyboard } from 'lucide-react';

export const CallsView: React.FC = () => {
    const [copied, setCopied] = useState(false);
    const [calls, setCalls] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuthStore();
    const { startCall } = useCallStore();
    const [callCode, setCallCode] = useState('');
    const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);
    const [createdLink, setCreatedLink] = useState('');

    useEffect(() => {
        const fetchCalls = async () => {
            if (!user?.id) return;
            try {
                const response = await callsApi.getCalls(Number(user.id));
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
        setCreatedLink(url);
        setIsNewMenuOpen(false);
    };

    const handleInstantCall = () => {
        setIsNewMenuOpen(false);
        const callId = Math.random().toString(36).substring(2, 12);
        startCall({ user: { username: `Meeting: ${callId}` }, userId: 9999 }, 'VIDEO');
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
            socketEmitters.initiateCall(participantId, callType, 0);
            startCall({ user: participantUser, userId: participantId }, callType);
        } catch (err) {
            console.error('Failed to replay call', err);
        }
    };

    const handleJoinWithCode = () => {
        if (!callCode.trim()) return;
        startCall({ user: { username: `Room: ${callCode}` }, userId: 9999 }, 'VIDEO');
        setCallCode('');
    };

    return (
        <div className="flex flex-col h-full bg-[#111827] w-full text-[#d1d7db]">
            <header className="h-[60px] flex items-center justify-between px-4 shrink-0 mt-2 sticky top-0 bg-[#111827] z-20">
                <h1 className="text-[22px] font-bold text-white">Calls & Meetings</h1>
            </header>

            <div className="px-4 py-6 border-b border-[#1F2937]/50 flex flex-col gap-4 shrink-0">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative">
                        <button
                            onClick={() => setIsNewMenuOpen(!isNewMenuOpen)}
                            className="w-full sm:w-auto h-11 px-5 bg-[#F97316] hover:bg-[#EA6C0A] text-white text-[15px] font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
                        >
                            <Video className="w-5 h-5" />
                            New meeting
                        </button>

                        {isNewMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsNewMenuOpen(false)}></div>
                                <div className="absolute top-14 left-0 w-72 bg-[#202c33] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                    <button onClick={handleCreateLink} className="w-full px-4 py-3 flex items-center gap-4 hover:bg-white/5 transition-colors text-left">
                                        <LinkIcon className="w-5 h-5 text-[#aebac1]" />
                                        <div>
                                            <div className="text-white text-[15px] font-medium">Create a meeting for later</div>
                                            <div className="text-[#aebac1] text-[13px]">Get a link you can share</div>
                                        </div>
                                    </button>
                                    <button onClick={handleInstantCall} className="w-full px-4 py-3 flex items-center gap-4 hover:bg-white/5 transition-colors text-left border-t border-white/5">
                                        <Plus className="w-5 h-5 text-[#aebac1]" />
                                        <div>
                                            <div className="text-white text-[15px] font-medium">Start an instant meeting</div>
                                            <div className="text-[#aebac1] text-[13px]">Join a room immediately</div>
                                        </div>
                                    </button>
                                    <button className="w-full px-4 py-3 flex items-center gap-4 hover:bg-white/5 transition-colors text-left border-t border-white/5 opacity-50 cursor-not-allowed">
                                        <Calendar className="w-5 h-5 text-[#aebac1]" />
                                        <div className="text-white text-[15px] font-medium">Schedule in Calendar</div>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex-1 flex items-center gap-2 h-11">
                        <div className="flex-1 relative bg-transparent rounded-lg h-full border border-[#374248] focus-within:border-[#F97316] transition-colors flex items-center overflow-hidden">
                            <div className="pl-4 pr-2 text-[#aebac1]">
                                <Keyboard className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                placeholder="Enter a code or link"
                                value={callCode}
                                onChange={(e) => setCallCode(e.target.value)}
                                className="w-full h-full bg-transparent pr-4 text-[15px] text-white outline-none placeholder:text-[#aebac1]"
                            />
                        </div>
                        <button
                            onClick={handleJoinWithCode}
                            disabled={!callCode.trim()}
                            className="h-full px-6 text-[#F97316] hover:bg-[#F97316]/10 disabled:text-[#aebac1] disabled:bg-transparent disabled:opacity-50 disabled:cursor-not-allowed text-[15px] font-medium rounded-lg transition-colors"
                        >
                            Join
                        </button>
                    </div>
                </div>

                {createdLink && (
                    <div className="mt-2 bg-[#202c33] border border-white/10 p-4 rounded-lg flex items-center justify-between shadow-md animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex-1 min-w-0 pr-4">
                            <p className="text-[14px] text-white font-medium mb-1">Here's the link to your meeting</p>
                            <p className="text-[13px] text-[#aebac1] truncate">Copy this link and send it to people you want to meet with.</p>
                            <div className="mt-2 bg-black/20 p-2 rounded text-[14px] text-white truncate select-all">{createdLink}</div>
                        </div>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(createdLink);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 3000);
                            }}
                            className="w-10 h-10 shrink-0 rounded-full hover:bg-white/10 flex items-center justify-center text-[#aebac1] hover:text-white transition-colors relative"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                            {copied && (
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#F97316] text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg">Copied</span>
                            )}
                        </button>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-4 block">
                <div className="pt-4">
                    <h3 className="text-[#aebac1] font-medium px-4 mb-2 text-[14px]">Recent calls</h3>

                    {isLoading ? (
                        <div className="flex justify-center p-4">
                            <div className="w-6 h-6 border-2 border-t-transparent border-[#F97316] rounded-full animate-spin"></div>
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
