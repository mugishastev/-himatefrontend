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
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ name: '', bio: '', avatarUrl: '' });
    const [isFollowing, setIsFollowing] = useState(false);
    const { user } = useAuthStore();
    const { setView } = useUIStore();

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                setIsFollowing(false);
                const data = await pagesApi.getPageByHandle(handle);
                setPage(data);
                setEditData({ name: data.name, bio: data.bio || '', avatarUrl: data.avatarUrl || '' });
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
            setPage(prev => prev ? { ...prev, _count: { ...prev._count, followers: (prev._count?.followers || 0) + 1 } } : null);
            setIsFollowing(true);
        } catch (err) {
            console.error('Error following', err);
        }
    };

    const handleUnfollow = async () => {
        if (!page) return;
        if (!confirm(`Unfollow ${page.name}?`)) return;
        try {
            await pagesApi.unfollowPage(page.id);
            setPage(prev => prev ? { ...prev, _count: { ...prev._count, followers: Math.max(0, (prev._count?.followers || 0) - 1) } } : null);
            setIsFollowing(false);
        } catch (err) {
            console.error('Error unfollowing', err);
        }
    };

    const handleReact = async (postId: number) => {
        try {
            await pagesApi.reactToPost(postId, 'LOVE');
            // Refresh feed or local state
            const updated = await pagesApi.getPageByHandle(handle);
            setPage(updated);
        } catch (err) {
            console.error('Error reacting:', err);
        }
    };

    const handleDeletePost = async (postId: number) => {
        if (!window.confirm('Are you sure you want to delete this post? This cannot be undone.')) return;
        try {
            await pagesApi.deletePost(postId);
            // Refresh feed
            const updated = await pagesApi.getPageByHandle(handle);
            setPage(updated);
            alert('Post deleted successfully.');
        } catch (err) {
            console.error('Error deleting post:', err);
            alert('Failed to delete post.');
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

    const handleUpdatePage = async () => {
        if (!page) return;
        try {
            await pagesApi.updatePage(page.id, editData);
            setPage(prev => prev ? { ...prev, ...editData } : null);
            setIsEditing(false);
            alert('Page updated successfully!');
        } catch (err) {
            console.error('Update failed', err);
            alert('Failed to update page.');
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
                            Back
                        </button>
                    )}
                </div>
                
                <div className="px-4 sm:px-8 pb-6 relative">
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
                                        onClick={isFollowing ? handleUnfollow : handleFollow}
                                        className="bg-[#f0f2f5] hover:bg-gray-200 text-text-primary px-6 py-2 rounded-full font-bold transition-colors shadow-sm"
                                    >
                                        {isFollowing ? 'Following' : 'Follow'}
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
                                <>
                                    <button 
                                        onClick={() => setView('CREATOR_STUDIO')} 
                                        className="bg-[#f0f2f5] hover:bg-gray-200 text-text-primary px-4 py-2 rounded-xl font-bold transition-colors shadow-sm"
                                    >
                                        Studio
                                    </button>
                                    <button 
                                        onClick={() => setIsEditing(!isEditing)} 
                                        className="bg-brand hover:bg-brand-dark text-white px-6 py-2 rounded-xl font-bold transition-colors shadow-md"
                                    >
                                        {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    
                    {isEditing ? (
                        <div className="space-y-4 max-w-lg">
                            <input 
                                className="text-3xl font-black text-text-primary bg-bg-secondary w-full px-2 py-1 rounded"
                                value={editData.name}
                                onChange={e => setEditData({...editData, name: e.target.value})}
                                placeholder="Page Name"
                            />
                            <textarea 
                                className="mt-4 text-text-primary w-full p-3 bg-bg-secondary rounded-xl min-h-[100px]"
                                value={editData.bio}
                                onChange={e => setEditData({...editData, bio: e.target.value})}
                                placeholder="Describe your page..."
                            />
                            <button 
                                onClick={handleUpdatePage}
                                className="bg-brand text-white px-8 py-2 rounded-xl font-bold hover:bg-brand-dark transition-all"
                            >
                                Save Changes
                            </button>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-3xl font-black text-text-primary flex items-center gap-2">
                                {page.name}
                                {page.isVerified && (
                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/10 text-blue-600" title="Verified Account">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </span>
                                )}
                            </h1>
                            <p className="text-text-secondary font-medium">@{page.handle} - {page._count?.followers || 0} followers</p>
                            <p className="mt-4 text-text-primary max-w-2xl">{page.bio}</p>
                        </>
                    )}
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
                                {isOwner && (
                                    <button 
                                        onClick={() => handleDeletePost(post.id)}
                                        className="ml-auto text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                                        title="Delete Post"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                )}
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
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 21s-7.5-4.35-9.6-9.18C.98 8.43 3.1 5.5 6.3 5.5c1.77 0 3.38.86 4.4 2.2 1.02-1.34 2.63-2.2 4.4-2.2 3.2 0 5.32 2.93 3.9 6.32C19.5 16.65 12 21 12 21z" />
                                    </svg>
                                    {post._count?.reactions || 0}
                                </button>
                                <button
                                    className="flex items-center gap-1 hover:text-blue-500 transition-colors font-medium text-sm"
                                    onClick={async () => {
                                        const link = `${window.location.origin}/pages/${page.handle}?post=${post.id}`;
                                        try {
                                            await navigator.clipboard.writeText(link);
                                            alert('Post link copied.');
                                        } catch {
                                            alert(link);
                                        }
                                    }}
                                >
                                    Copy link
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
