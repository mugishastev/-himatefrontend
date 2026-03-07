import React, { useRef, useState } from 'react';
import { useMessages } from '../../../hooks/useMessages';
import { AttachmentPreview } from './AttachmentPreview';
import { useConversationStore } from '../../../store/conversation.store';
import { socketEmitters } from '../../../socket';

export const MessageInput: React.FC = () => {
    const [content, setContent] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [isEmojiOpen, setIsEmojiOpen] = useState(false);
    const [isAttachMenuOpen, setIsAttachMenuOpen] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recordSeconds, setRecordSeconds] = useState(0);

    const { sendMessage, updateMessage } = useMessages();
    const { activeConversationId, editingMessage, setEditingMessage } = useConversationStore();

    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const mediaInputRef = useRef<HTMLInputElement>(null);
    const documentInputRef = useRef<HTMLInputElement>(null);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const emojiRef = useRef<HTMLDivElement>(null);
    const attachmentRef = useRef<HTMLDivElement>(null);
    const recordTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const emojiList = ['😀', '😂', '😍', '🔥', '👍', '🙏', '🎉', '🤝', '😎', '💬', '❤️', '✅'];

    const waveform = [4, 10, 16, 8, 12, 6, 14, 9, 5, 11];

    const autoGrow = () => {
        const el = textAreaRef.current;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = `${Math.min(160, el.scrollHeight)}px`;
    };

    React.useEffect(() => {
        autoGrow();
    }, [content]);

    React.useEffect(() => {
        if (editingMessage) {
            setContent(editingMessage.content);
            textAreaRef.current?.focus();
        } else {
            setContent('');
        }
    }, [editingMessage]);

    React.useEffect(() => {
        const closeOnOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (!emojiRef.current?.contains(target)) setIsEmojiOpen(false);
            if (!attachmentRef.current?.contains(target)) setIsAttachMenuOpen(false);
        };
        document.addEventListener('mousedown', closeOnOutside);
        return () => document.removeEventListener('mousedown', closeOnOutside);
    }, []);

    React.useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            if (recordTimerRef.current) clearInterval(recordTimerRef.current);
        };
    }, []);

    const emitTyping = () => {
        if (!activeConversationId) return;
        socketEmitters.sendTyping(activeConversationId, true);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socketEmitters.sendTyping(activeConversationId, false);
        }, 900);
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() && !file) return;

        if (editingMessage) {
            await updateMessage(Number(editingMessage.id), content);
            setEditingMessage(null);
        } else {
            await sendMessage(content, file);
        }

        if (activeConversationId) socketEmitters.sendTyping(activeConversationId, false);
        setContent('');
        setFile(null);
        if (textAreaRef.current) textAreaRef.current.style.height = 'auto';
    };

    const handleFileSelect = (selectedFile?: File | null) => {
        if (!selectedFile) return;
        setFile(selectedFile);
        setIsAttachMenuOpen(false);
    };

    const handleSendLocation = () => {
        if (!navigator.geolocation) {
            setContent((prev) => `${prev}${prev ? '\n' : ''}📍 Live location unavailable on this device`);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const mapLink = `https://maps.google.com/?q=${latitude},${longitude}`;
                setContent((prev) => `${prev}${prev ? '\n' : ''}📍 Live location: ${mapLink}`);
                setIsAttachMenuOpen(false);
            },
            () => {
                setContent((prev) => `${prev}${prev ? '\n' : ''}📍 Failed to get your location`);
            }
        );
    };

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const secondsRef = useRef(0);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            const recorder = new MediaRecorder(stream);
            mediaRecorderRef.current = recorder;
            audioChunksRef.current = [];
            secondsRef.current = 0;

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    audioChunksRef.current.push(e.data);
                }
            };

            recorder.start();
            setIsRecording(true);
            setRecordSeconds(0);
            recordTimerRef.current = setInterval(() => {
                setRecordSeconds((s) => s + 1);
                secondsRef.current += 1;
            }, 1000);
        } catch (err) {
            console.error('Failed to start recording', err);
            alert('Could not access microphone');
        }
    };

    const stopAndSendRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const audioFile = new File([audioBlob], `voice-note-${Date.now()}.webm`, { type: 'audio/webm' });

                if (secondsRef.current > 0) {
                    await sendMessage('', audioFile);
                }

                streamRef.current?.getTracks().forEach(track => track.stop());
                setRecordSeconds(0);
                secondsRef.current = 0;
            };
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (recordTimerRef.current) clearInterval(recordTimerRef.current);
        }
    };

    const discardRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.onstop = () => {
                streamRef.current?.getTracks().forEach(track => track.stop());
                setRecordSeconds(0);
                secondsRef.current = 0;
            };
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (recordTimerRef.current) clearInterval(recordTimerRef.current);
        }
    };

    return (
        <div className="shrink-0 bg-[#f0f2f5] border-t border-[#e9edef] px-3 py-2 space-y-2">
            {editingMessage && (
                <div className="flex items-center justify-between bg-brand/5 border border-brand/10 p-2 rounded-xl animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="flex items-center gap-2 text-brand">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        <span className="text-xs font-bold uppercase">Editing Message</span>
                    </div>
                    <button onClick={() => setEditingMessage(null)} className="p-1 hover:bg-white/50 rounded-full text-text-muted transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            )}

            {file && (
                <div className="flex animate-in slide-in-from-bottom-2 duration-300">
                    <AttachmentPreview file={file} onRemove={() => setFile(null)} />
                </div>
            )}

            <form onSubmit={handleSend} className="flex items-end gap-2 relative">

                {isRecording ? (
                    // Recording UI
                    <div className="flex-1 flex items-center justify-between bg-white rounded-full px-4 py-2 border border-brand/20 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
                        <button
                            type="button"
                            onClick={discardRecording}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            title="Discard voice note"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>

                        <div className="flex items-center gap-4 flex-1 justify-center">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-[pulse_1s_ease-in-out_infinite]"></span>
                            <span className="text-sm font-semibold tracking-widest text-[#111b21]">
                                {Math.floor(recordSeconds / 60)}:{(recordSeconds % 60).toString().padStart(2, '0')}
                            </span>
                            <div className="flex items-end gap-[3px] h-6 px-4">
                                {waveform.map((bar, i) => (
                                    <span key={i} className="w-1 rounded-full bg-brand/50 animate-[pulse_0.5s_ease-in-out_infinite]" style={{ height: `${bar + (i % 3) * 3}px` }} />
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    // Normal Input UI
                    <div className="flex items-end gap-2 flex-1 animate-in fade-in slide-in-from-left-4 duration-300">
                        {/* Emoji picker */}
                        <div className="relative" ref={emojiRef}>
                            <button
                                type="button"
                                onClick={() => setIsEmojiOpen((v) => !v)}
                                className="p-2.5 text-[#54656f] hover:text-[#111b21] transition-colors rounded-full hover:bg-black/5"
                                title="Emoji"
                            >
                                <span className="text-2xl leading-none">😊</span>
                            </button>
                            {isEmojiOpen && (
                                <div className="absolute bottom-14 left-0 z-30 bg-white rounded-2xl border border-gray-100 shadow-xl p-3 w-56">
                                    <div className="grid grid-cols-6 gap-1">
                                        {emojiList.map((emoji) => (
                                            <button
                                                key={emoji}
                                                type="button"
                                                className="text-xl hover:bg-bg-secondary rounded-md p-1"
                                                onClick={() => setContent((prev) => `${prev}${emoji}`)}
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="relative" ref={attachmentRef}>
                            <button
                                type="button"
                                onClick={() => setIsAttachMenuOpen((v) => !v)}
                                className="p-2.5 text-[#54656f] hover:text-[#111b21] transition-colors rounded-full hover:bg-black/5"
                                title="Attachments"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                </svg>
                            </button>

                            {isAttachMenuOpen && (
                                <div className="absolute bottom-14 left-0 z-30 bg-white rounded-2xl border border-gray-100 shadow-xl p-2 w-44 space-y-1">
                                    <button type="button" className="w-full text-left px-3 py-2 rounded-lg hover:bg-bg-secondary text-sm font-medium text-text-primary" onClick={() => mediaInputRef.current?.click()}>
                                        Media (Image/Video)
                                    </button>
                                    <button type="button" className="w-full text-left px-3 py-2 rounded-lg hover:bg-bg-secondary text-sm font-medium text-text-primary" onClick={() => documentInputRef.current?.click()}>
                                        Document
                                    </button>
                                    <button type="button" className="w-full text-left px-3 py-2 rounded-lg hover:bg-bg-secondary text-sm font-medium text-text-primary" onClick={handleSendLocation}>
                                        Live Location
                                    </button>
                                </div>
                            )}

                            <input
                                type="file"
                                ref={mediaInputRef}
                                accept="image/*,video/*"
                                onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                                className="hidden"
                            />
                            <input
                                type="file"
                                ref={documentInputRef}
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
                                onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                                className="hidden"
                            />
                        </div>

                        {/* Text input */}
                        <div className="flex-1 relative">
                            <textarea
                                ref={textAreaRef}
                                value={content}
                                onChange={(e) => {
                                    setContent(e.target.value);
                                    emitTyping();
                                }}
                                placeholder="Type a message"
                                rows={1}
                                className="w-full px-4 py-2.5 bg-[#1F2937] border border-white/10 rounded-xl outline-none focus:border-[#F97316]/60 resize-none transition-all duration-200 text-white placeholder:text-[#9CA3AF] text-[15px] overflow-y-auto max-h-40"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend(e);
                                    }
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Mic / Send button */}
                {!content.trim() && !file && !isRecording ? (
                    <button
                        type="button"
                        onClick={startRecording}
                        className="w-11 h-11 rounded-full flex items-center justify-center transition-all shrink-0 bg-[#F97316] text-white hover:bg-[#EA6C0A] hover:scale-105"
                        title="Record Voice Note"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14a3 3 0 003-3V7a3 3 0 10-6 0v4a3 3 0 003 3zm0 0v4m-4 0h8" />
                        </svg>
                    </button>
                ) : isRecording ? (
                    <button
                        type="button"
                        onClick={stopAndSendRecording}
                        className="w-11 h-11 rounded-full bg-[#F97316] hover:bg-[#EA6C0A] hover:scale-105 text-white flex items-center justify-center transition-all shrink-0 shadow-sm z-10"
                        title="Send Voice Note"
                    >
                        <svg className="w-5 h-5 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                        </svg>
                    </button>
                ) : (
                    <button
                        type="submit"
                        className="w-11 h-11 rounded-full bg-[#F97316] hover:bg-[#EA6C0A] text-white flex items-center justify-center transition-all shrink-0 shadow-sm disabled:opacity-50"
                        disabled={!content.trim() && !file}
                    >
                        {editingMessage ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 rotate-90" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                            </svg>
                        )}
                    </button>
                )}
            </form>
        </div>
    );
};
