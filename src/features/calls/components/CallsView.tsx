import React, { useState } from 'react';

// For now, this is a placeholder/mock of the Calls View.
// It matches the general layout style of the application.
export const CallsView: React.FC = () => {
    const [copied, setCopied] = useState(false);

    const handleCreateLink = () => {
        // Generate a random call ID
        const callId = Math.random().toString(36).substring(2, 12);
        const url = `${window.location.origin}/call/${callId}`;

        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        });
    };

    return (
        <div className="flex flex-col h-full bg-[#111827] w-full text-[#d1d7db]">
            {/* Header */}
            <header className="h-[60px] flex items-center justify-between px-4 shrink-0 mt-2">
                <h1 className="text-[22px] font-bold text-white">Calls</h1>
                <div className="flex items-center gap-3 text-[#aebac1]">
                    <button className="p-2 hover:bg-white/5 rounded-full transition-colors group" title="New call">
                        <svg className="w-5 h-5 text-[#aebac1] group-hover:text-[#d1d7db]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* Search Bar */}
            <div className="px-3 py-2 flex items-center gap-2 shrink-0">
                <div className="flex-1 relative bg-[#1F2937] rounded-lg h-9">
                    <input
                        type="text"
                        placeholder="Search name or number"
                        className="w-full h-full bg-transparent pl-12 pr-4 text-[14px] text-white outline-none placeholder:text-[#aebac1]"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#aebac1]">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-4 block">
                <div className="pt-2">
                    <h3 className="text-[#aebac1] font-medium px-4 mb-2 text-[14px]">Favourites</h3>
                    {/* Start call button */}
                    <div
                        onClick={handleCreateLink}
                        className="flex items-center px-4 py-2.5 hover:bg-[#1F2937]/50 cursor-pointer transition-colors group/item relative"
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${copied ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#00a884] text-white'}`}>
                            {copied ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                            )}
                        </div>
                        <div className="ml-3 flex-1 min-w-0 py-1">
                            <h2 className="text-[17px] font-medium text-white truncate break-all leading-tight">Create call link</h2>
                            <p className="text-[13px] text-[#aebac1] truncate">Share a link for your Himate call</p>
                        </div>
                        {copied && (
                            <div className="absolute right-4 bg-[#202c33] border border-[#313d45] text-[#d1d7db] text-xs py-1.5 px-3 rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-2 z-10">
                                Link copied!
                            </div>
                        )}
                    </div>
                    {/* View all text */}
                    <div className="px-4 py-3">
                        <button className="text-[#00a884] text-[14px] hover:underline">View all</button>
                    </div>
                </div>

                <div className="pt-2 border-t border-[#1F2937]/50 mt-2">
                    <h3 className="text-[#aebac1] font-medium px-4 mb-2 text-[14px]">Recent</h3>

                    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
                        <div className="w-20 h-20 bg-[#1F2937] rounded-full flex items-center justify-center mb-6">
                            <svg className="w-8 h-8 text-[#aebac1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-medium text-[#d1d7db] mb-2">No recent calls</h2>
                        <p className="text-[14px] text-[#aebac1] max-w-[300px]">
                            Your most recent calls will show up here.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
