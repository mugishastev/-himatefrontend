import React, { useEffect, useState, useRef } from 'react';
import { useCallStore } from '../../../store/call.store';
import { UserAvatar } from '../../users/components/UserAvatar';
import { socketEmitters } from '../../../socket/socket.emitters';

export const CallOverlay: React.FC = () => {
    const { status, type, participant, startTime, acceptCall, endCall, isIncoming } = useCallStore();
    const [durationText, setDurationText] = useState('00:00');
    
    // Real media stream references
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasStream, setHasStream] = useState(false);

    // Remove the 4-second automatic answer to prevent unwanted recording
    // The call will now only connect when manually picked up (simulated)

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
                    setHasStream(true);
                    
                    if (videoRef.current) {
                        videoRef.current.srcObject = mediaStream;
                    }
                } catch (err) {
                    console.error('Failed to access camera or microphone:', err);
                }
            }
        };

        startMediaCapture();

        return () => {
            // Stop recording / capturing when the component unmounts or status changes
            if (activeStream) {
                activeStream.getTracks().forEach(track => track.stop());
                setHasStream(false);
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

    if (status === 'IDLE') return null;

    const isVideo = type === 'VIDEO';
    const isConnected = status === 'CONNECTED';
    
    const displayName = participant?.user?.username || 'Contact';

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#111827]/95 backdrop-blur-md animate-in fade-in duration-300">
            {/* Background elements to add depth */}
            <div className="absolute w-96 h-96 bg-[#00a884]/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="z-10 flex flex-col items-center max-w-sm w-full p-8 text-center text-white relative">
                
                {/* Developer testing button removed, real sockets are implemented now */}
                
                <span className="text-[#aebac1] uppercase tracking-widest text-[12px] font-semibold mb-6">
                    {isVideo ? 'End-to-end encrypted video call' : 'End-to-end encrypted voice call'}
                </span>

                <div className="relative mb-6">
                    {participant?.user ? (
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#1F2937] shadow-2xl relative">
                            {/* Glowing rings effect while outgoing */}
                            {!isConnected && (
                                <div className="absolute inset-0 rounded-full border border-[#00a884] animate-ping opacity-75" style={{ animationDuration: '2s' }} />
                            )}
                            <UserAvatar user={participant.user} size="lg" />
                        </div>
                    ) : (
                        <div className="w-32 h-32 rounded-full bg-[#1F2937] border-4 border-[#374248] shadow-2xl flex items-center justify-center text-4xl font-medium">
                            {displayName.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

                <h1 className="text-3xl font-normal leading-tight mb-2 tracking-wide">
                    {displayName}
                </h1>
                
                <p className="text-[#aebac1] text-[15px] font-medium h-6">
                    {status === 'OUTGOING' && !isIncoming && 'Calling...'}
                    {status === 'INCOMING' && 'Incoming call...'}
                    {status === 'CONNECTED' && durationText}
                </p>

                {/* Live Media Interface */}
                {isConnected && (
                    <div className="mt-8 mb-4 w-full h-48 bg-black/50 rounded-2xl border border-white/10 flex items-center justify-center shadow-inner relative overflow-hidden backdrop-blur-sm">
                        {/* The actual video element (hidden via styling if audio only, or shown if video) */}
                        <video 
                            ref={videoRef}
                            autoPlay 
                            playsInline 
                            muted // Muted locally so you don't hear your own echo
                            className={`w-full h-full object-cover ${(!isVideo || !hasStream) ? 'hidden' : 'block'}`}
                        />
                        
                        {/* Fallback visual if no stream yet or if audio-only */}
                        {(!hasStream || !isVideo) && (
                            <div className="flex flex-col items-center justify-center">
                                {isVideo ? (
                                    <svg className="w-8 h-8 text-white/20 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                                ) : (
                                    <div className="flex gap-2 items-end h-8">
                                        <div className="w-1.5 h-3 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-1.5 h-6 bg-[#00a884] rounded-full justify-self-end animate-pulse" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-1.5 h-4 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                                        <div className="w-1.5 h-8 bg-[#00a884] rounded-full animate-pulse" style={{ animationDelay: '450ms' }}></div>
                                        <div className="w-1.5 h-5 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></div>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {/* Live indicator overlay */}
                        <span className="absolute bottom-3 left-4 text-[12px] text-white/50 bg-black/40 px-2 pl-3 pb-[1px] rounded-full backdrop-blur-md flex items-center gap-2">
                           <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></div> Live
                        </span>
                    </div>
                )}

                <div className="flex items-center justify-center gap-8 mt-12 w-full">
                    {/* INCOMING CALL ACTIONS */}
                    {status === 'INCOMING' ? (
                        <>
                            <button 
                                onClick={handleEnd}
                                className="w-16 h-16 rounded-full bg-[#ef4444] hover:bg-[#dc2626] flex items-center justify-center text-white transition-all shadow-xl hover:scale-105 active:scale-95"
                            >
                                <svg className="w-7 h-7 rotate-[135deg]" fill="currentColor" viewBox="0 0 24 24"><path d="M8.3 4h7.4c.5 0 .9.5.6.9l-2.6 4.6c-.3.4-1 .4-1.3 0L9.8 4.9C9.5 4.5 9.9 4 10.4 4zm14.8 17l-4.7-6.5c-.3-.4-1-.5-1.4-.2l-2.4 1.7L10.3 8.8l1.7-2.4c.3-.4.2-1.1-.3-1.4L5.2.3c-.5-.4-1.2-.2-1.5.3L1.5 5c-.7 1.1-.9 2.4-.6 3.7 1.7 6.1 6.5 11 12.6 12.6 1.3.3 2.6.1 3.7-.6l4.4-2.2c.4-.3.6-1 .2-1.5z"/></svg>
                            </button>

                            <button 
                                onClick={handleAccept}
                                className="w-16 h-16 rounded-full bg-[#00a884] hover:bg-[#00c99e] flex items-center justify-center text-white transition-all shadow-xl hover:scale-105 active:scale-95 animate-bounce"
                            >
                                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M8.3 4h7.4c.5 0 .9.5.6.9l-2.6 4.6c-.3.4-1 .4-1.3 0L9.8 4.9C9.5 4.5 9.9 4 10.4 4zm14.8 17l-4.7-6.5c-.3-.4-1-.5-1.4-.2l-2.4 1.7L10.3 8.8l1.7-2.4c.3-.4.2-1.1-.3-1.4L5.2.3c-.5-.4-1.2-.2-1.5.3L1.5 5c-.7 1.1-.9 2.4-.6 3.7 1.7 6.1 6.5 11 12.6 12.6 1.3.3 2.6.1 3.7-.6l4.4-2.2c.4-.3.6-1 .2-1.5z"/></svg>
                            </button>
                        </>
                    ) : (
                    /* OUTGOING OR CONNECTED ACTIONS */
                        <>
                            <button className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors backdrop-blur-sm shadow-xl">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.91.41-.91.91C17 14.86 14.77 17 12 17s-5-2.14-5-5.09c0-.5-.42-.91-.91-.91s-.91.41-.91.91C5.18 15.53 8.36 18.6 12 18.92V21h-1c-.55 0-1 .45-1 1s.45 1 1 1h2c.55 0 1-.45 1-1s-.45-1-1-1h-1v-2.08c3.64-.32 6.82-3.39 6.82-7.01 0-.5-.41-.91-.91-.91z"/></svg>
                            </button>
                            {isVideo && (
                                <button className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors backdrop-blur-sm shadow-xl">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                                </button>
                            )}
                            <button 
                                onClick={handleEnd}
                                className="w-16 h-16 rounded-full bg-[#ef4444] hover:bg-[#dc2626] flex items-center justify-center text-white transition-all shadow-xl hover:scale-105 active:scale-95"
                            >
                                <svg className="w-7 h-7 rotate-[135deg]" fill="currentColor" viewBox="0 0 24 24"><path d="M8.3 4h7.4c.5 0 .9.5.6.9l-2.6 4.6c-.3.4-1 .4-1.3 0L9.8 4.9C9.5 4.5 9.9 4 10.4 4zm14.8 17l-4.7-6.5c-.3-.4-1-.5-1.4-.2l-2.4 1.7L10.3 8.8l1.7-2.4c.3-.4.2-1.1-.3-1.4L5.2.3c-.5-.4-1.2-.2-1.5.3L1.5 5c-.7 1.1-.9 2.4-.6 3.7 1.7 6.1 6.5 11 12.6 12.6 1.3.3 2.6.1 3.7-.6l4.4-2.2c.4-.3.6-1 .2-1.5z"/></svg>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
