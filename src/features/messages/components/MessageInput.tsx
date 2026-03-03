import React, { useRef, useState } from 'react';
import { useMessages } from '../../../hooks/useMessages';
import { Button } from '../../../components/ui/Button';
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

    const { sendMessage } = useMessages();
    const { activeConversationId } = useConversationStore();

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

        await sendMessage(content, file);
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

    const startRecording = () => {
        setIsRecording(true);
        setRecordSeconds(0);
        recordTimerRef.current = setInterval(() => {
            setRecordSeconds((s) => s + 1);
        }, 1000);
    };

    const stopRecording = async () => {
        setIsRecording(false);
        if (recordTimerRef.current) {
            clearInterval(recordTimerRef.current);
            recordTimerRef.current = null;
        }
        if (recordSeconds === 0) return;
        await sendMessage(`🎤 Voice note (${recordSeconds}s)`);
        setRecordSeconds(0);
    };

    return (
        <div className="p-4 bg-white border-t border-gray-100 space-y-3">
            {file && (
                <div className="flex animate-in slide-in-from-bottom-2 duration-300">
                    <AttachmentPreview file={file} onRemove={() => setFile(null)} />
                </div>
            )}

            {isRecording && (
                <div className="bg-bg-secondary border border-gray-200 rounded-2xl px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                        <span className="text-sm font-bold text-text-primary">Recording {recordSeconds}s</span>
                    </div>
                    <div className="flex items-end gap-1 h-6">
                        {waveform.map((bar, i) => (
                            <span key={i} className="w-1 rounded bg-brand/70 animate-pulse" style={{ height: `${bar + (i % 3) * 3}px` }} />
                        ))}
                    </div>
                </div>
            )}

            <form onSubmit={handleSend} className="flex space-x-3 items-end">
                <div className="relative" ref={emojiRef}>
                    <button
                        type="button"
                        onClick={() => setIsEmojiOpen((v) => !v)}
                        className="p-3 hover:bg-bg-secondary rounded-2xl text-text-secondary transition-all hover:text-brand border border-dashed border-gray-200 hover:border-brand"
                        title="Emoji"
                    >
                        <span className="text-xl">😊</span>
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
                        className="p-3 hover:bg-bg-secondary rounded-2xl text-text-secondary transition-all hover:text-brand border border-dashed border-gray-200 hover:border-brand"
                        title="Attachments"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
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

                <div className="flex-1 relative">
                    <textarea
                        ref={textAreaRef}
                        value={content}
                        onChange={(e) => {
                            setContent(e.target.value);
                            emitTyping();
                        }}
                        placeholder="Type a message..."
                        rows={1}
                        className="w-full px-5 py-3.5 bg-bg-secondary border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 resize-none transition-all duration-200 text-text-primary overflow-y-auto max-h-40"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend(e);
                            }
                        }}
                    />
                </div>

                <button
                    type="button"
                    onMouseDown={startRecording}
                    onMouseUp={stopRecording}
                    onMouseLeave={() => {
                        if (isRecording) stopRecording();
                    }}
                    onTouchStart={startRecording}
                    onTouchEnd={stopRecording}
                    className={`rounded-2xl w-14 h-14 p-0 flex items-center justify-center border transition-all ${isRecording ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-gray-200 text-text-secondary hover:text-brand hover:border-brand/40'}`}
                    title="Hold to record voice note"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14a3 3 0 003-3V7a3 3 0 10-6 0v4a3 3 0 003 3zm0 0v4m-4 0h8" />
                    </svg>
                </button>

                <Button
                    type="submit"
                    variant="primary"
                    className="rounded-2xl w-14 h-14 p-0 flex items-center justify-center shadow-lg shadow-brand/20 active:scale-95 transition-transform"
                    disabled={!content.trim() && !file}
                >
                    <svg className="w-7 h-7 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </Button>
            </form>
        </div>
    );
};
