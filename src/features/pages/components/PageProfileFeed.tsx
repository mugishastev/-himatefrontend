import React, { useEffect, useState } from 'react';
import type { Page, PagePost } from '../../../api/pages.api';
import { pagesApi } from '../../../api/pages.api';
import { useAuthStore } from '../../../store/auth.store';
import { useUIStore } from '../../../store/ui.store';

interface Props {
    handle: string;
    onBack?: () => void;
}

export const PageProfileFeed: React.FC<Props> = ({ handle, onBack }) => {
    const [page, setPage] = useState<(Page & { posts: PagePost[] }) | null>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthStore();
    const { setView } = useUIStore();

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const data = await pagesApi.getPageByHandle(handle);
                setPage(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchFeed();
    }, [handle]);

    const handleFollow = async () => {
        if (!page) return;
        try {
            await pagesApi.followPage(page.id);
            alert(`You are now following ${page.name}!`);
            setPage(prev => prev ? { ...prev, _count: { ...prev._count, followers: (prev._count?.followers || 0) + 1 } } : null);
        } catch (err) {
            console.error('Error following', err);
        }
    };

    const handleReact = async (postId: number) => {
        try {
            await pagesApi.reactToPost(postId, '❤️');
            // Refresh feed or local state
            const updated = await pagesApi.getPageByHandle(handle);
            setPage(updated);
        } catch (err) {
            console.error('Error reacting:', err);
        }
    };

    const handleMessageSupport = async () => {
        if (!page) return;
        try {
            await pagesApi.messagePage(page.id);
            // After creating the support conversation, we switch the user to the Chats view.
            // The logic in ConversationList will automatically include this new support chat.
            setView('CHATS');
            alert(`Opening support ticket with ${page.name}. You can find it in your Chats list!`);
        } catch (err) {
            console.error('Error starting support chat', err);
            alert('Could not start support chat. Please try again.');
        }
    };

    if (loading) return <div className="p-10 flex justify-center"><div className="animate-spin w-8 h-8 rounded-full border-4 border-brand border-t-transparent" /></div>;
    if (!page) return <div className="p-10 text-center">Page not found.</div>;

    const isOwner = user?.id === page.ownerId;

    return (
        <div className="flex-1 flex flex-col h-full bg-[#efeae2] overflow-y-auto">
            {/* Header / Banner */}
            <div className="relative bg-white shadow-sm z-10">
                <div className="h-48 bg-gradient-to-r from-brand/80 to-brand-dark w-full overflow-hidden relative">
                    {page.coverPhotoUrl && <img src={page.coverPhotoUrl} alt="Cover" className="w-full h-full object-cover opacity-60" />}
                    {onBack && (
                        <button onClick={onBack} className="absolute top-4 left-4 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 backdrop-blur-md">
                            ← Back
                        </button>
                    )}
                </div>
                
                <div className="px-8 pb-6 relative">
                    <div className="flex justify-between items-end -mt-12 mb-4">
                        <div className="w-24 h-24 rounded-full border-4 border-white bg-white overflow-hidden shadow-lg">
                            {page.avatarUrl ? (
                                <img src={page.avatarUrl} alt={page.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-brand/10 flex items-center justify-center text-4xl font-bold text-brand">
                                    {page.name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="flex gap-3">
                            {!isOwner && (
                                <>
                                    <button 
                                        onClick={handleFollow}
                                        className="bg-[#f0f2f5] hover:bg-gray-200 text-text-primary px-6 py-2 rounded-full font-bold transition-colors shadow-sm"
                                    >
                                        Follow
                                    </button>
                                    <button 
                                        onClick={handleMessageSupport}
                                        className="bg-brand hover:bg-brand-dark text-white px-6 py-2 rounded-full font-bold transition-colors shadow-md flex items-center gap-2"
                                    >
                                        Message
                                    </button>
                                </>
                            )}
                            {isOwner && (
                                <button onClick={() => setView('CREATOR_STUDIO')} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full font-bold transition-colors shadow-md">
                                    Creator Studio
                                </button>
                            )}
                        </div>
                    </div>
                    
                    <h1 className="text-3xl font-black text-text-primary flex items-center gap-2">
                        {page.name}
                        {page.isVerified && <span className="text-blue-500 text-2xl" title="Verified Account">☑️</span>}
                    </h1>
                    <p className="text-text-secondary font-medium">@{page.handle} • {page._count?.followers || 0} followers</p>
                    <p className="mt-4 text-text-primary max-w-2xl">{page.bio}</p>
                </div>
            </div>

            {/* The Blog Feed */}
            <div className="max-w-2xl mx-auto w-full p-4 space-y-6 pt-8 pb-20">
                {page.posts.length === 0 ? (
                    <div className="text-center text-text-secondary bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        This page hasn't published any posts yet.
                    </div>
                ) : (
                    page.posts.map(post => (
                        <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Post Header */}
                            <div className="p-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-brand/10 overflow-hidden">
                                     {page.avatarUrl ? <img src={page.avatarUrl} className="w-full h-full object-cover" /> : null}
                                </div>
                                <div>
                                    <h4 className="font-bold text-[15px]">{page.name}</h4>
                                    <p className="text-xs text-text-secondary">{new Date(post.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            
                            {/* Post Content */}
                            <div className="px-4 pb-2 text-[15px] leading-relaxed whitespace-pre-wrap">
                                {post.content}
                            </div>
                            
                            {/* Post Media (Carousels) */}
                            {post.mediaUrls && post.mediaUrls.length > 0 && (
                                <div className="mt-2 grid grid-cols-1 gap-1">
                                    {post.mediaUrls.map((url, i) => (
                                        <img key={i} src={url} alt="Blog Asset" className="w-full max-h-96 object-cover" />
                                    ))}
                                </div>
                            )}
                            
                            {/* Post Footer / Reactions */}
                            <div className="p-3 border-t border-gray-100 flex items-center gap-4 text-text-secondary px-4">
                                <button 
                                    onClick={() => handleReact(post.id)}
                                    className="flex items-center gap-1 hover:text-red-500 transition-colors"
                                >
                                    <span className="text-xl">❤️</span> {post._count?.reactions || 0}
                                </button>
                                <button className="flex items-center gap-1 hover:text-blue-500 transition-colors font-medium text-sm">
                                    Share to Chat
                                </button>
                                <span className="ml-auto text-xs">{post.views} views</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
