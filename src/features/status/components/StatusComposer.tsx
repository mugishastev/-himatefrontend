import React, { useRef, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { statusesApi } from '../../../api/statuses.api';
import { useAuthStore } from '../../../store/auth.store';

interface StatusComposerProps {
    onCreated: () => void;
}

export const StatusComposer: React.FC<StatusComposerProps> = ({ onCreated }) => {
    const { user } = useAuthStore();
    const [content, setContent] = useState('');
    const [media, setMedia] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id || !content.trim()) return;
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
            onCreated();
        } catch (error) {
            console.error('Failed to publish status', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-3">
            <h3 className="font-black text-text-primary tracking-tight">Post Status / Blog Update</h3>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share an update with your network..."
                rows={4}
                className="w-full p-3 rounded-xl bg-bg-secondary border border-gray-100 outline-none focus:ring-2 focus:ring-brand/20 resize-none"
            />
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="text-sm font-semibold text-brand hover:underline"
                >
                    {media ? `Attached: ${media.name}` : 'Attach media'}
                </button>
                <input
                    ref={fileRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => setMedia(e.target.files?.[0] || null)}
                />
                <Button type="submit" isLoading={isLoading} disabled={!content.trim()}>
                    Publish
                </Button>
            </div>
        </form>
    );
};
