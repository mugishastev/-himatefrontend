import React, { useEffect, useState } from 'react';
import type { Page } from '../../../api/pages.api';
import { pagesApi } from '../../../api/pages.api';
import { useUIStore } from '../../../store/ui.store';

export const CreatorStudioView: React.FC = () => {
    const { setView } = useUIStore();
    const [myPage, setMyPage] = useState<Page | null>(null);
    const [analytics, setAnalytics] = useState<{ followersCount: number, postsCount: number, totalViews: number, unreadTickets: number } | null>(null);
    const [content, setContent] = useState('');
    const [mediaUrl, setMediaUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const pages = await pagesApi.getMyPages();
                if (pages.length > 0) {
                    const firstPage = pages[0];
                    setMyPage(firstPage);
                    const stats = await pagesApi.getPageAnalytics(firstPage.id);
                    setAnalytics(stats);
                }
            } catch (err) {
                console.error('Failed to load creator data:', err);
            } finally {
                setFetching(false);
            }
        };
        loadDashboard();
    }, []);

    const handlePublish = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || !myPage) return;
        
        setLoading(true);
        try {
            await pagesApi.createPost(myPage.id, {
                content,
                mediaUrls: mediaUrl ? [mediaUrl] : []
            });
            alert('Blog successfully published and broadcasted to your followers!');
            setContent('');
            setMediaUrl('');
            
            // Refresh analytics
            const stats = await pagesApi.getPageAnalytics(myPage.id);
            setAnalytics(stats);
        } catch (err: any) {
            console.error(err);
            alert('Error publishing post.');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const res = await pagesApi.uploadMedia(file);
            setMediaUrl(res.url);
        } catch (err) {
            console.error('Upload failed', err);
            alert('Failed to upload image.');
        } finally {
            setUploading(false);
        }
    };

    if (fetching) return <div className="flex-1 flex items-center justify-center bg-bg-secondary text-text-secondary font-bold">Synchronizing Studio...</div>;
    if (!myPage) return <div className="flex-1 flex flex-col items-center justify-center bg-bg-secondary p-8 text-center uppercase">
        <h2 className="text-2xl font-black mb-4">No Page Found</h2>
        <button onClick={() => setView('PAGES')} className="bg-brand text-white px-6 py-2 rounded-xl font-bold">Create a Page</button>
    </div>;

    return (
        <div className="flex-1 overflow-y-auto bg-bg-secondary w-full p-4 sm:p-8 transition-all duration-500">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black text-text-primary tracking-tight">Creator Studio</h1>
                        <p className="text-text-secondary mt-1">Broadcast to your fans and manage your brand.</p>
                    </div>
                    <div className="bg-brand text-white px-4 py-2 rounded-full font-bold text-sm shadow-sm flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        Status: Live
                    </div>
                </div>

                {/* Dashboard Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center">
                        <span className="text-sm font-bold text-text-secondary uppercase">Total Followers</span>
                        <div className="text-4xl font-black text-text-primary mt-2">
                            {analytics?.followersCount ?? 0}
                        </div>
                        <span className="text-xs text-green-500 font-bold mt-2">Live updates available</span>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center">
                        <span className="text-sm font-bold text-text-secondary uppercase">Total Posts</span>
                        <div className="text-4xl font-black text-text-primary mt-2">
                            {analytics?.postsCount ?? 0}
                        </div>
                        <span className="text-xs text-text-secondary font-bold mt-2">Published content</span>
                    </div>
                    <div className="bg-gradient-to-br from-brand to-brand-dark p-6 rounded-3xl shadow-lg flex flex-col justify-center text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        </div>
                        <span className="text-sm font-bold text-white/80 uppercase">Unread Support Chats</span>
                        <div className="text-4xl font-black mt-2">{analytics?.unreadTickets ?? 0}</div>
                        <button 
                            onClick={() => setView('PAGE_INBOX')}
                            className="text-xs bg-white text-brand font-bold mt-4 py-1.5 px-3 rounded-full w-max hover:bg-gray-100 transition-colors"
                        >
                            Open Inbox
                        </button>
                    </div>
                </div>

                {/* The Publisher Console */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
                        <span className="w-9 h-9 rounded-2xl bg-brand/10 text-brand flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 20h9" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
                            </svg>
                        </span>
                        <h2 className="text-xl font-bold text-text-primary">Publish New Blog</h2>
                    </div>
                    <div className="p-6">
                        <form onSubmit={handlePublish} className="space-y-4">
                            <textarea
                                className="w-full text-lg p-0 focus:outline-none border-0 min-h-[150px] resize-y placeholder-gray-300 font-medium"
                                placeholder="What's going on with your brand today? Drop an announcement..."
                                value={content}
                                onChange={e => setContent(e.target.value)}
                            />
                            
                            {mediaUrl && (
                                <div className="relative rounded-2xl overflow-hidden border border-gray-100">
                                    <img src={mediaUrl} className="w-full max-h-64 object-cover" alt="Attached preview" />
                                    <button 
                                        type="button" 
                                        onClick={() => setMediaUrl('')}
                                        className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            )}

                            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex gap-2">
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        className="hidden" 
                                        accept="image/*" 
                                        onChange={handleFileChange}
                                    />
                                    <button 
                                        type="button" 
                                        className="p-3 text-brand bg-brand/10 hover:bg-brand/20 rounded-xl transition-colors font-bold flex items-center gap-2 disabled:opacity-50"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h3l2-2h8l2 2h3v12H3V7z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 17a4 4 0 100-8 4 4 0 000 8z" />
                                        </svg>
                                        {uploading ? 'Uploading...' : 'Attach Image'}
                                    </button>
                                </div>
                                <button 
                                    className="bg-brand text-white font-bold py-3 px-8 rounded-xl shadow-md hover:bg-brand-dark transition-colors disabled:opacity-50"
                                    disabled={loading || !content.trim()}
                                >
                                    {loading ? 'Broadcasting...' : 'Publish to Feed'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
