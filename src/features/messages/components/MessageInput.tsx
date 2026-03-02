import React, { useState, useRef } from 'react';
import { useMessages } from '../../../hooks/useMessages';
import { Button } from '../../../components/ui/Button';
import { AttachmentPreview } from './AttachmentPreview';

export const MessageInput: React.FC = () => {
    const [content, setContent] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const { sendMessage } = useMessages();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() && !file) return;

        // Pass both content and file to sendMessage
        await sendMessage(content, file);
        setContent('');
        setFile(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    return (
        <div className="p-4 bg-white border-t border-gray-100 space-y-3">
            {file && (
                <div className="flex animate-in slide-in-from-bottom-2 duration-300">
                    <AttachmentPreview file={file} onRemove={() => setFile(null)} />
                </div>
            )}
            <form onSubmit={handleSend} className="flex space-x-3 items-end">
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 hover:bg-bg-secondary rounded-2xl text-text-secondary transition-all hover:text-brand border border-dashed border-gray-200 hover:border-brand"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </button>
                <div className="flex-1 relative">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Type a message..."
                        rows={1}
                        className="w-full px-5 py-3.5 bg-bg-secondary border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 resize-none transition-all duration-200 text-text-primary"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend(e);
                            }
                        }}
                    />
                </div>
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
