import React, { useEffect, useRef, useState } from 'react';
import { statusesApi } from '../../../api/statuses.api';
import { StatusComposer } from './StatusComposer';
import type { StatusPost } from '../../../types/status.types';
import { formatRelativeTime } from '../../../utils/date';
import { useAuthStore } from '../../../store/auth.store';

interface StatusFeedProps {
    refreshKey: number;
}

const StoryProgressBar: React.FC<{ total: number; current: number; progress: number }> = ({ total, current, progress }) => (
    <div className="flex gap-1 w-full px-4 pt-4">
        {Array.from({ length: total }).map((_, i) => (
            <div key={i} className="flex-1 h-[2px] rounded-full bg-white/30 overflow-hidden">
                <div
                    className="h-full bg-white rounded-full transition-none"
                    style={{
                        width: i < current ? '100%' : i === current ? `${progress}%` : '0%',
                    }}
                />
            </div>
        ))}
    </div>
);

export const StatusFeed: React.FC<StatusFeedProps> = ({ refreshKey }) => {
    const { user } = useAuthStore();
    const [items, setItems] = useState<StatusPost[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [viewingGroup, setViewingGroup] = useState<{ statuses: StatusPost[]; index: number } | null>(null);
    const [storyProgress, setStoryProgress] = useState(0);
    const [showComposer, setShowComposer] = useState(false);
    const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const loadStatuses = async () => {
        setIsLoading(true);
        try {
            const data = await statusesApi.getStatuses();
            const itemsArray = Array.isArray(data) ? data : (data as any).data || [];
            setItems(itemsArray);
        } catch (err) {
            console.error('Failed to fetch statuses', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { loadStatuses(); }, [refreshKey]);

    // Auto-advance stories every 5s
    useEffect(() => {
        if (!viewingGroup) { setStoryProgress(0); return; }
        setStoryProgress(0);
        if (progressRef.current) clearInterval(progressRef.current);
        progressRef.current = setInterval(() => {
            setStoryProgress(prev => {
                if (prev >= 100) {
                    // advance to next
                    setViewingGroup(vg => {
                        if (!vg) return null;
                        if (vg.index < vg.statuses.length - 1) {
                            return { ...vg, index: vg.index + 1 };
                        }
                        clearInterval(progressRef.current!);
                        return null;
                    });
                    return 0;
                }
                return prev + 2; // 2% per 100ms = 5s total
            });
        }, 100);
        return () => { if (progressRef.current) clearInterval(progressRef.current); };
    }, [viewingGroup?.statuses, viewingGroup?.index]);

    // Group statuses by user
    const grouped = items.reduce((acc, s) => {
        const key = String(s.userId);
        if (!acc[key]) acc[key] = [];
        acc[key].push(s);
        return acc;
    }, {} as Record<string, StatusPost[]>);

    const myStatuses = grouped[String(user?.id)] || [];
    const otherGroups = Object.entries(grouped).filter(([uid]) => uid !== String(user?.id));

    const currentStory = viewingGroup?.statuses[viewingGroup.index];

    const openStory = (statuses: StatusPost[], index = 0) => {
        setViewingGroup({ statuses, index });
        setStoryProgress(0);
    };

    const closeStory = () => {
        if (progressRef.current) clearInterval(progressRef.current);
        setViewingGroup(null);
    };

    const goNext = () => {
        if (!viewingGroup) return;
        if (viewingGroup.index < viewingGroup.statuses.length - 1) {
            setViewingGroup({ ...viewingGroup, index: viewingGroup.index + 1 });
        } else {
            closeStory();
        }
    };

    const goPrev = () => {
        if (!viewingGroup) return;
        if (viewingGroup.index > 0) {
            setViewingGroup({ ...viewingGroup, index: viewingGroup.index - 1 });
        }
    };

    return (
        <div className="flex h-full overflow-hidden bg-white">

            {/* ── Left Panel: Status List ───────────────────── */}
            <div className="w-full flex flex-col h-full overflow-hidden border-r border-[#f0f2f5]">

                {/* Header */}
                <header className="h-[60px] bg-[#f0f2f5] flex items-center justify-between px-4 shrink-0 border-b border-[#e9edef]">
                    <h2 className="text-[19px] font-semibold text-[#111b21]">Status</h2>
                    <div className="flex items-center gap-1 text-[#54656f]">
                        <button
                            onClick={() => setShowComposer(true)}
                            className="p-2 hover:bg-black/5 rounded-full transition-colors"
                            title="New status"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                        <button className="p-2 hover:bg-black/5 rounded-full transition-colors" title="More options">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 4.001A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 4.001A2 2 0 0 0 12 15z" />
                            </svg>
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto no-scrollbar">

                    {/* My Status */}
                    <div
                        className="flex items-center gap-3 px-4 py-3 hover:bg-[#f5f6f6] cursor-pointer border-b border-[#f0f2f5] transition-colors"
                        onClick={() => myStatuses.length > 0 ? openStory(myStatuses) : setShowComposer(true)}
                    >
                        {/* Avatar ring */}
                        <div className="relative shrink-0">
                            <div className={`w-[49px] h-[49px] rounded-full p-[2px] ${myStatuses.length > 0 ? 'bg-brand' : 'bg-[#dfe5e7]'}`}>
                                <div className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center text-[#667781] font-medium text-xl">
                                    {user?.avatarUrl
                                        ? <img src={user.avatarUrl} alt="me" className="w-full h-full object-cover" />
                                        : (user?.username || 'M').charAt(0).toUpperCase()
                                    }
                                </div>
                            </div>
                            {myStatuses.length === 0 && (
                                <div className="absolute bottom-0 right-0 w-5 h-5 bg-brand rounded-full border-2 border-white flex items-center justify-center text-white text-[11px] font-bold">+</div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[17px] text-[#111b21] font-normal">My status</p>
                            <p className="text-[13px] text-[#667781]">
                                {myStatuses.length > 0
                                    ? `${formatRelativeTime(myStatuses[0].createdAt)} · ${myStatuses.length} update${myStatuses.length > 1 ? 's' : ''}`
                                    : 'Tap to add status update'}
                            </p>
                        </div>
                        <button
                            onClick={e => { e.stopPropagation(); setShowComposer(true); }}
                            className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center hover:bg-brand/20 transition-colors shrink-0"
                            title="Add status"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>

                    {/* Status Composer (inline when visible) */}
                    {showComposer && (
                        <div className="border-b border-[#f0f2f5]">
                            <StatusComposer onCreated={() => { setShowComposer(false); loadStatuses(); }} />
                        </div>
                    )}

                    {/* Recent updates header */}
                    {otherGroups.length > 0 && (
                        <>
                            <div className="px-4 py-2 bg-[#f0f2f5]">
                                <p className="text-[13px] text-[#667781] font-medium">Recent updates</p>
                            </div>
                            {isLoading ? (
                                <div className="px-4 py-6 text-[#667781] text-sm">Loading...</div>
                            ) : (
                                otherGroups.map(([uid, statuses]) => {
                                    const first = statuses[0];
                                    const name = first.user?.username || `User #${uid}`;
                                    return (
                                        <div
                                            key={uid}
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-[#f5f6f6] cursor-pointer border-b border-[#f0f2f5] transition-colors"
                                            onClick={() => openStory(statuses)}
                                        >
                                            <div className="shrink-0 w-[49px] h-[49px] rounded-full p-[2px] bg-brand">
                                                <div className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center text-[#667781] font-medium text-xl">
                                                    {first.user?.avatarUrl
                                                        ? <img src={first.user.avatarUrl} alt={name} className="w-full h-full object-cover" />
                                                        : name.charAt(0).toUpperCase()
                                                    }
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[17px] text-[#111b21] truncate">{name}</p>
                                                <p className="text-[13px] text-[#667781]">
                                                    {formatRelativeTime(first.createdAt)} · {statuses.length} update{statuses.length > 1 ? 's' : ''}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </>
                    )}

                    {!isLoading && items.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
                            <div className="w-20 h-20 rounded-full bg-brand/10 flex items-center justify-center mb-4">
                                <svg className="w-9 h-9 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-[#111b21] font-medium mb-1">No updates yet</p>
                            <p className="text-[13px] text-[#667781]">Status updates from your contacts appear here.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Full-screen Story Viewer (overlay) ───────── */}
            {viewingGroup && currentStory && (
                <div className="fixed inset-0 z-50 bg-black flex flex-col" onClick={closeStory}>

                    {/* Progress bars */}
                    <StoryProgressBar
                        total={viewingGroup.statuses.length}
                        current={viewingGroup.index}
                        progress={storyProgress}
                    />

                    {/* Story header */}
                    <div className="flex items-center gap-3 px-4 pt-3 pb-2" onClick={e => e.stopPropagation()}>
                        <div className="w-10 h-10 rounded-full bg-brand overflow-hidden flex items-center justify-center text-white font-medium shrink-0">
                            {currentStory.user?.avatarUrl
                                ? <img src={currentStory.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                                : (currentStory.user?.username || 'U').charAt(0).toUpperCase()
                            }
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-medium text-sm">
                                {currentStory.user?.username || `User #${currentStory.userId}`}
                            </p>
                            <p className="text-white/60 text-xs">{formatRelativeTime(currentStory.createdAt)}</p>
                        </div>
                        <button onClick={closeStory} className="p-2 text-white/70 hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Story content */}
                    <div className="flex-1 relative flex items-center justify-center" onClick={e => e.stopPropagation()}>
                        {currentStory.mediaUrl ? (
                            <img src={currentStory.mediaUrl} alt="status" className="max-h-full max-w-full object-contain" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center px-10">
                                <p className="text-white text-2xl font-medium text-center leading-relaxed">
                                    {currentStory.content}
                                </p>
                            </div>
                        )}

                        {/* Caption over image */}
                        {currentStory.mediaUrl && currentStory.content && (
                            <div className="absolute bottom-6 left-0 right-0 px-6">
                                <p className="text-white text-base text-center bg-black/40 rounded-xl px-4 py-2 backdrop-blur-sm">
                                    {currentStory.content}
                                </p>
                            </div>
                        )}

                        {/* Tap zones */}
                        <button
                            className="absolute left-0 top-0 w-1/3 h-full"
                            onClick={goPrev}
                            aria-label="Previous"
                        />
                        <button
                            className="absolute right-0 top-0 w-1/3 h-full"
                            onClick={goNext}
                            aria-label="Next"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
