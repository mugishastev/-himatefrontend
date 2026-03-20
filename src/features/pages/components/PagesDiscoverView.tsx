import React, { useEffect, useState } from 'react';
import type { Page } from '../../../api/pages.api';
import { pagesApi } from '../../../api/pages.api';

export const PagesDiscoverView: React.FC = () => {
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPages = async () => {
            try {
                const data = await pagesApi.getDiscoverPages();
                setPages(data);
            } catch (error) {
                console.error('Failed to load discover pages', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPages();
    }, []);

    return (
        <div className="flex flex-col h-full bg-bg-secondary w-full">
            <header className="h-[60px] bg-bg-primary border-b border-border-light flex items-center px-6 shrink-0 z-10">
                <h1 className="text-xl font-bold text-text-primary">Discover Pages</h1>
            </header>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="bg-brand/10 border border-brand/20 p-6 rounded-2xl flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-brand mb-1">Create your own Page</h2>
                        <p className="text-sm text-text-secondary">Are you a brand, business, or creator? Build your audience.</p>
                    </div>
                    <button 
                        className="bg-brand text-white px-5 py-2.5 rounded-xl font-medium hover:bg-brand-dark transition-colors"
                        onClick={() => alert('Creator Studio incoming!')}
                    >
                        Get Started
                    </button>
                </div>

                <h3 className="text-lg font-bold text-text-secondary uppercase tracking-wider text-xs">Trending Brands</h3>
                
                {loading ? (
                    <div className="flex justify-center p-10"><div className="animate-spin w-8 h-8 rounded-full border-4 border-brand border-t-transparent" /></div>
                ) : pages.length === 0 ? (
                    <div className="text-center text-text-secondary p-10">No pages discovered yet!</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pages.map(page => (
                            <div key={page.id} className="bg-bg-primary rounded-2xl border border-border-light p-5 hover:shadow-lg transition-shadow">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden shrink-0 border border-border-light">
                                        {page.avatarUrl ? (
                                            <img src={page.avatarUrl} alt={page.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-brand/20 flex items-center justify-center text-brand font-bold text-xl">
                                                {page.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-text-primary truncate flex items-center gap-1">
                                            {page.name}
                                            {page.isVerified && <span className="text-blue-500" title="Verified">☑️</span>}
                                        </h4>
                                        <p className="text-xs text-text-secondary truncate">@{page.handle} • {page._count?.followers || 0} followers</p>
                                    </div>
                                </div>
                                <p className="text-sm text-text-secondary mb-5 line-clamp-2 min-h[2.5rem]">
                                    {page.bio || "No description provided."}
                                </p>
                                <button 
                                    className="w-full bg-[#f0f2f5] hover:bg-gray-200 text-text-primary font-medium py-2 rounded-xl transition-colors"
                                    onClick={() => {
                                        // Normally this would open the PageFeed
                                        alert(`Navigating to @${page.handle}'s blog feed!`);
                                    }}
                                >
                                    View Feed
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
