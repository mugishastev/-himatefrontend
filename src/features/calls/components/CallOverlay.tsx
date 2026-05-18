import React, { useEffect, useState, useRef } from 'react';
import { useCallStore } from '../../../store/call.store';
import { UserAvatar } from '../../users/components/UserAvatar';
import { socketEmitters } from '../../../socket/socket.emitters';
import { Phone, PhoneOff, Mic, MicOff, Video as VideoIcon, VideoOff, Volume2, MonitorUp, MessageSquare, UserPlus, Copy } from 'lucide-react';

export const CallOverlay: React.FC = () => {
    const { status, type, participant, startTime, acceptCall, endCall, isIncoming } = useCallStore();
    const [durationText, setDurationText] = useState('00:00');

    // Toggles for UI
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [chatMessage, setChatMessage] = useState('');
    const [messages, setMessages] = useState<{ sender: string, text: string }[]>([]);

    // Real media stream references
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    // Timer logic
    useEffect(() => {
        let interval: any;
        if (status === 'CONNECTED' && startTime) {
            interval = setInterval(() => {
                const diff = Math.floor((Date.now() - startTime) / 1000);
                const minutes = Math.floor(diff / 60).toString().padStart(2, '0');
                const seconds = (diff % 60).toString().padStart(2, '0');
                setDurationText(`${minutes}:${seconds}`);
            }, 1000);
        } else {
            setDurationText('00:00');
        }
        return () => clearInterval(interval);
    }, [status, startTime]);

    // Media capture logic (start recording camera/mic when picked up)
    useEffect(() => {
        let activeStream: MediaStream | null = null;

        const startMediaCapture = async () => {
            if (status === 'CONNECTED') {
                try {
                    const mediaStream = await navigator.mediaDevices.getUserMedia({
                        video: type === 'VIDEO' ? { facingMode: 'user' } : false,
                        audio: true
                    });
                    activeStream = mediaStream;

                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = mediaStream;
                    }
                } catch (err) {
                    console.error('Failed to access camera or microphone:', err);
                }
            }
        };

        startMediaCapture();

        return () => {
            if (activeStream) {
                activeStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [status, type]);

    const handleAccept = () => {
        acceptCall();
        if (participant?.userId) {
            socketEmitters.acceptCall(participant.userId);
        }
    };

    const handleEnd = () => {
        endCall();
        if (participant?.userId) {
            socketEmitters.endCall(participant.userId);
        }
    };

    const handleScreenShare = async () => {
        try {
            if (!isScreenSharing) {
                const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
                if (localVideoRef.current) localVideoRef.current.srcObject = displayStream;
                setIsScreenSharing(true);

                displayStream.getVideoTracks()[0].onended = async () => {
                    const cameraStream = await navigator.mediaDevices.getUserMedia({
                        video: type === 'VIDEO' ? { facingMode: 'user' } : false,
                        audio: true
                    });
                    if (localVideoRef.current) localVideoRef.current.srcObject = cameraStream;
                    setIsScreenSharing(false);
                };
            } else {
                if (localVideoRef.current && localVideoRef.current.srcObject) {
                    (localVideoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
                }
                const cameraStream = await navigator.mediaDevices.getUserMedia({
                    video: type === 'VIDEO' ? { facingMode: 'user' } : false,
                    audio: true
                });
                if (localVideoRef.current) localVideoRef.current.srcObject = cameraStream;
                setIsScreenSharing(false);
            }
        } catch (err) {
            console.error('Screen sharing failed:', err);
        }
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatMessage.trim()) return;
        setMessages([...messages, { sender: 'You', text: chatMessage }]);
        setChatMessage('');
    };

    if (status === 'IDLE') return null;

    const isVideo = type === 'VIDEO';
    const isConnected = status === 'CONNECTED';
    const displayName = participant?.user?.username || 'Contact';

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-[#111827]/95 backdrop-blur-md animate-in fade-in duration-300 overflow-hidden">

            {/* Full Screen Remote Video Background */}
            {isConnected && isVideo && (
                <div className="absolute inset-0 z-0 bg-black">
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                    />
                    {isVideoOff && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                            <div className="relative">
                                <div className="absolute inset-0 rounded-full border-2 border-green-500 animate-ping opacity-75" style={{ animationDuration: '2s' }} />
                                {participant?.user ? (
                                    <UserAvatar user={participant.user} size="lg" className="w-40 h-40 border-4 border-gray-800" />
                                ) : (
                                    <div className="w-40 h-40 rounded-full bg-gray-800 border-4 border-gray-700 flex items-center justify-center text-5xl font-medium text-white shadow-2xl z-10 relative">
                                        <span className="z-10 relative">{displayName.charAt(0).toUpperCase()}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Non-Video or Non-Connected Background Elements */}
            {(!isConnected || !isVideo) && (
                <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
                    <div className="w-96 h-96 bg-[#F97316]/10 rounded-full blur-[100px]" />
                </div>
            )}

            {/* Top Header */}
            <div className="z-10 w-full p-6 flex justify-between items-start relative">
                <div className="flex gap-4">
                    {isConnected && (
                        <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors backdrop-blur-sm shadow-xl" title="Copy Link">
                            <Copy className="w-5 h-5" />
                        </button>
                    )}
                </div>

                <div className="flex flex-col items-center">
                    <span className="text-[#aebac1] uppercase tracking-widest text-[12px] font-semibold mb-1 drop-shadow-md">
                        {isVideo ? 'End-to-end encrypted video call' : 'End-to-end encrypted voice call'}
                    </span>
                    {isConnected && (
                        <span className="text-white/90 text-sm font-medium bg-black/30 px-3 py-1 rounded-full backdrop-blur-md">
                            {durationText}
                        </span>
                    )}
                </div>

                <div className="flex gap-4">
                    {isConnected && (
                        <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors backdrop-blur-sm shadow-xl" title="Add Participant">
                            <UserPlus className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Center Content (Avatar/Status when not in active video) */}
            {(!isConnected || (!isVideo && isConnected)) && (
                <div className="z-10 flex flex-col items-center text-white flex-1 justify-center">
                    <div className="relative mb-6">
                        {participant?.user ? (
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#1F2937] shadow-2xl relative">
                                {!isConnected && (
                                    <div className="absolute inset-0 rounded-full border border-[#F97316] animate-ping opacity-75" style={{ animationDuration: '2s' }} />
                                )}
                                {isConnected && !isVideo && (
                                    <div className="absolute inset-0 rounded-full border-2 border-green-500 animate-pulse opacity-75" />
                                )}
                                <UserAvatar user={participant.user} size="lg" />
                            </div>
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-[#1F2937] border-4 border-[#374248] shadow-2xl flex items-center justify-center text-4xl font-medium relative">
                                {!isConnected && (
                                    <div className="absolute inset-0 rounded-full border border-[#F97316] animate-ping opacity-75" style={{ animationDuration: '2s' }} />
                                )}
                                {isConnected && !isVideo && (
                                    <div className="absolute inset-0 rounded-full border-2 border-green-500 animate-pulse opacity-75" />
                                )}
                                <span className="z-10 relative">{displayName.charAt(0).toUpperCase()}</span>
                            </div>
                        )}
                    </div>

                    <h1 className="text-3xl font-normal leading-tight mb-2 tracking-wide drop-shadow-lg">
                        {displayName}
                    </h1>

                    {!isConnected && (
                        <p className="text-[#aebac1] text-[15px] font-medium h-6">
                            {status === 'OUTGOING' && !isIncoming && 'Calling...'}
                            {status === 'INCOMING' && 'Incoming call...'}
                        </p>
                    )}
                </div>
            )}

            {/* Local PIP Video */}
            {isConnected && isVideo && (
                <div className={`absolute bottom-32 right-6 w-32 h-48 sm:w-40 sm:h-60 bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border-2 z-20 transition-transform hover:scale-105 cursor-pointer ${isScreenSharing ? 'border-[#F97316]' : 'border-white/20'}`}>
                    <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* In-Call Chat Overlay */}
            {isConnected && isChatOpen && (
                <div className="absolute top-24 right-6 w-80 max-w-[calc(100vw-3rem)] h-[60vh] bg-[#111b21]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col z-30 overflow-hidden animate-in slide-in-from-right-8 duration-300">
                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
                        <h3 className="text-white font-medium">In-Call Messages</h3>
                        <button onClick={() => setIsChatOpen(false)} className="text-[#aebac1] hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                        {messages.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-[#aebac1] text-sm text-center px-4">
                                Messages are encrypted. They will disappear when the call ends.
                            </div>
                        ) : (
                            messages.map((msg, idx) => (
                                <div key={idx} className="flex flex-col items-end">
                                    <span className="text-xs text-[#aebac1] mb-1 mr-1">{msg.sender}</span>
                                    <div className="bg-[#005c4b] text-[#e9edef] px-3 py-2 rounded-lg rounded-tr-none max-w-[85%] text-[15px] shadow-sm">
                                        {msg.text}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <form onSubmit={handleSendMessage} className="p-3 bg-[#202c33] border-t border-white/10 flex gap-2">
                        <input
                            type="text"
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            placeholder="Message..."
                            className="flex-1 bg-[#2a3942] text-white text-[15px] rounded-full px-4 py-2 outline-none focus:ring-1 focus:ring-[#F97316]/50 placeholder:text-[#aebac1]"
                        />
                        <button type="submit" disabled={!chatMessage.trim()} className="w-10 h-10 rounded-full bg-[#F97316] hover:bg-[#EA6C0A] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white shrink-0 transition-colors">
                            <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                        </button>
                    </form>
                </div>
            )}

            {/* Bottom Controls */}
            <div className="z-20 w-full pb-8 pt-4 flex justify-center bg-gradient-to-t from-black/80 to-transparent">
                {status === 'INCOMING' ? (
                    <div className="flex items-center gap-12">
                        <button
                            onClick={handleEnd}
                            className="w-16 h-16 rounded-full bg-[#ef4444] hover:bg-[#dc2626] flex items-center justify-center text-white transition-all shadow-xl hover:scale-105 active:scale-95"
                        >
                            <PhoneOff className="w-7 h-7" />
                        </button>
                        <button
                            onClick={handleAccept}
                            className="w-16 h-16 rounded-full bg-[#F97316] hover:bg-[#EA6C0A] flex items-center justify-center text-white transition-all shadow-xl hover:scale-105 active:scale-95 animate-bounce"
                        >
                            <Phone className="w-7 h-7" />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-4 bg-slate-800/80 backdrop-blur-md px-6 py-3 rounded-full shadow-2xl border border-white/10">

                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors ${isMuted ? 'bg-red-500/80 hover:bg-red-600/80' : 'bg-white/10 hover:bg-white/20'}`}
                            title="Toggle Microphone"
                        >
                            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                        </button>

                        {isVideo && (
                            <button
                                onClick={() => setIsVideoOff(!isVideoOff)}
                                className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors ${isVideoOff ? 'bg-red-500/80 hover:bg-red-600/80' : 'bg-white/10 hover:bg-white/20'}`}
                                title="Toggle Video"
                            >
                                {isVideoOff ? <VideoOff className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
                            </button>
                        )}

                        <div className="w-px h-8 bg-white/20 mx-2"></div>

                        <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors" title="Audio Output">
                            <Volume2 className="w-5 h-5" />
                        </button>

                        {isVideo && (
                            <button
                                onClick={handleScreenShare}
                                className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors ${isScreenSharing ? 'bg-[#F97316]/80 hover:bg-[#EA6C0A]/80 shadow-[0_0_15px_rgba(249,115,22,0.5)]' : 'bg-white/10 hover:bg-white/20'}`}
                                title="Share Screen"
                            >
                                <MonitorUp className="w-5 h-5" />
                            </button>
                        )}

                        <button
                            onClick={() => setIsChatOpen(!isChatOpen)}
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors ${isChatOpen ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20'}`}
                            title="Chat Overlay"
                        >
                            <MessageSquare className="w-5 h-5" />
                        </button>

                        <div className="w-px h-8 bg-white/20 mx-2"></div>

                        <button
                            onClick={handleEnd}
                            className="w-14 h-14 rounded-full bg-[#ef4444] hover:bg-[#dc2626] flex items-center justify-center text-white transition-all shadow-xl hover:scale-105 active:scale-95 ml-2"
                            title="End Call"
                        >
                            <PhoneOff className="w-6 h-6" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
