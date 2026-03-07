import React, { useRef, useState } from 'react';
import { statusesApi } from '../../../api/statuses.api';
import { useAuthStore } from '../../../store/auth.store';

interface StatusComposerProps {
    onCreated: () => void;
}

export const StatusComposer: React.FC<StatusComposerProps> = ({ onCreated }) => {
    const { user } = useAuthStore();
    const [content, setContent] = useState('');
    const [media, setMedia] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setMedia(file);
        if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
        } else {
            setPreview(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id || (!content.trim() && !media)) return;
        setIsLoading(true);
        try {
            const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
            await statusesApi.createStatus({
                userId: Number(user.id),
                content: content.trim(),
                expiresAt,
                media,
            });
            setContent('');
            setMedia(null);
            setPreview(null);
            onCreated();
        } catch (error) {
            console.error('Failed to publish status', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 space-y-3">
            {/* Media preview */}
            {preview && (
                <div className="relative rounded-xl overflow-hidden bg-black">
                    <img src={preview} alt="preview" className="w-full max-h-48 object-cover" />
                    <button
                        type="button"
                        onClick={() => { setMedia(null); setPreview(null); }}
                        className="absolute top-2 right-2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Text input */}
            <div className="flex items-end gap-3">
                <div className="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center text-brand shrink-0 text-sm font-bold">
                    {(user?.username || 'M').charAt(0).toUpperCase()}
                </div>
                <textarea
                    id="status-text-trigger"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="Share a photo, link, or thought..."
                    rows={2}
                    maxLength={500}
                    className="flex-1 px-4 py-2.5 bg-[#f0f2f5] rounded-xl outline-none resize-none text-[15px] text-[#111b21] placeholder:text-[#667781] focus:bg-white border border-transparent focus:border-brand/20 transition-all"
                />
            </div>

            {/* Action bar */}
            <div className="flex items-center justify-between pl-12">
                <div className="flex items-center gap-2">
                    {/* Attach photo/video */}
                    <button
                        id="status-camera-trigger"
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="w-9 h-9 flex items-center justify-center rounded-full text-[#54656f] hover:bg-[#f0f2f5] transition-colors"
                        title="Add photo or video"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </button>
                    <input
                        ref={fileRef}
                        type="file"
                        className="hidden"
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                    />
                    <span className="text-xs text-[#667781]">{content.length}/500</span>
                </div>

                <button
                    type="submit"
                    disabled={isLoading || (!content.trim() && !media)}
                    className="flex items-center gap-2 px-5 py-2 bg-brand text-white rounded-full text-[13px] font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                        </svg>
                    )}
                    {isLoading ? 'Posting...' : 'Post'}
                </button>
            </div>
        </form>
    );
};
