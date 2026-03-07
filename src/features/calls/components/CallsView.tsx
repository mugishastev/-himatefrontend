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
        <div className="flex flex-col h-full bg-white w-full max-w-2xl mx-auto md:border-x md:border-gray-200">
            {/* Header */}
            <header className="h-[100px] shrink-0 bg-[#f0f2f5] px-6 flex flex-col justify-end pb-4 relative z-10 shadow-sm border-b border-gray-200">
                <div className="flex justify-between items-center mt-auto">
                    <h1 className="text-2xl font-bold text-[#111b21]">Calls</h1>
                    <div className="flex gap-4">
                        <button className="text-[#54656f] hover:bg-black/5 p-2 rounded-full transition-colors" title="New call">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* List */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="p-4 space-y-4">
                    {/* Start call button */}
                    <div
                        onClick={handleCreateLink}
                        className="flex items-center space-x-4 p-3 hover:bg-[#f5f6f6] cursor-pointer transition-colors rounded-xl group/item relative"
                    >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors ${copied ? 'bg-emerald-100 text-emerald-600' : 'bg-brand/10 text-brand'}`}>
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
                        <div className="flex-1 min-w-0">
                            <h2 className="text-[17px] font-medium text-[#111b21] truncate">Create call link</h2>
                            <p className="text-[14px] text-[#667781] truncate">Share a link for your Himate call</p>
                        </div>
                        {copied && (
                            <div className="absolute right-4 bg-[#111b21] text-white text-xs py-1.5 px-3 rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-2">
                                Link copied!
                            </div>
                        )}
                    </div>

                    <div className="pt-2">
                        <h3 className="text-[#111b21] font-medium px-3 mb-2">Recent</h3>

                        <div className="flex flex-col items-center justify-center text-center py-16 px-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-medium text-[#111b21] mb-2">No recent calls</h2>
                            <p className="text-[15px] text-[#667781] max-w-[300px]">
                                Your most recent calls will show up here.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
