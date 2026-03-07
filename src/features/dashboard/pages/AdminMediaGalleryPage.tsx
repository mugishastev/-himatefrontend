import React, { useEffect, useState } from 'react';
import { adminApi } from '../../../api/admin.api';

const MediaTypeColors: Record<string, string> = {
    IMAGE: 'bg-blue-500',
    AUDIO: 'bg-brand',
    VIDEO: 'bg-violet-500',
    FILE: 'bg-amber-500',
};
const MediaTypeLabels: Record<string, string> = {
    IMAGE: 'Images',
    AUDIO: 'Audio / Voice Notes',
    VIDEO: 'Videos',
    FILE: 'Documents',
};

export const AdminMediaGalleryPage: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminApi.getStats().then((data) => {
            setStats(data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const media = stats?.messages?.media ?? {};
    const totalMedia = Object.values(media).reduce((acc: number, v) => acc + (v as number), 0);

    const estimatedMB = {
        IMAGE: (media.images ?? 0) * 0.3,
        AUDIO: (media.audio ?? 0) * 0.15,
        VIDEO: (media.video ?? 0) * 8,
        FILE: (media.files ?? 0) * 0.5,
    };
    const totalMB = Object.values(estimatedMB).reduce((a, b) => a + b, 0);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-white mb-2">Media Gallery</h1>
            <p className="text-slate-400 text-sm mb-8">Monitor storage usage by media type across all conversations</p>

            {loading ? (
                <div className="text-center py-24 text-brand animate-pulse font-bold">Loading media stats...</div>
            ) : (
                <div className="space-y-8">
                    {/* Storage Summary */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {(['IMAGE', 'AUDIO', 'VIDEO', 'FILE'] as const).map((type) => (
                            <div key={type} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors">
                                <div className={`w-10 h-10 rounded-xl ${MediaTypeColors[type]}/20 flex items-center justify-center mb-4`}>
                                    <div className={`w-3 h-3 rounded-full ${MediaTypeColors[type]}`} />
                                </div>
                                <p className="text-slate-400 text-xs font-medium">{MediaTypeLabels[type]}</p>
                                <p className="text-2xl font-bold text-white mt-1">{(media[type.toLowerCase() === 'file' ? 'files' : type.toLowerCase() + (type === 'IMAGE' ? 's' : type === 'AUDIO' ? '' : 's')] ?? (type === 'IMAGE' ? media.images : type === 'AUDIO' ? media.audio : type === 'VIDEO' ? media.video : media.files) ?? 0).toLocaleString()}</p>
                                <p className="text-xs text-slate-500 mt-1">≈ {estimatedMB[type].toFixed(1)} MB estimated</p>
                            </div>
                        ))}
                    </div>

                    {/* Storage Bar */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-base font-semibold text-slate-200">Storage Breakdown</h2>
                            <span className="text-slate-400 text-sm font-medium">{totalMedia.toLocaleString()} total files · ~{totalMB.toFixed(0)} MB estimated</span>
                        </div>

                        {/* Stacked bar */}
                        <div className="flex h-3 rounded-full overflow-hidden bg-slate-800 mb-6">
                            {Object.entries(estimatedMB).map(([type, mb]) => (
                                <div
                                    key={type}
                                    className={`${MediaTypeColors[type]} transition-all`}
                                    style={{ width: totalMB > 0 ? `${(mb / totalMB) * 100}%` : '0%' }}
                                    title={`${MediaTypeLabels[type]}: ${mb.toFixed(1)} MB`}
                                />
                            ))}
                        </div>

                        <div className="space-y-3">
                            {Object.entries(estimatedMB).map(([type, mb]) => (
                                <div key={type}>
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${MediaTypeColors[type]}`} />
                                            <span className="text-sm text-slate-400">{MediaTypeLabels[type]}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-semibold text-slate-300">{mb.toFixed(1)} MB</span>
                                            <span className="text-xs text-slate-600 ml-2">({totalMB > 0 ? ((mb / totalMB) * 100).toFixed(0) : 0}%)</span>
                                        </div>
                                    </div>
                                    <div className="h-1.5 w-full rounded-full bg-slate-800">
                                        <div className={`h-1.5 rounded-full ${MediaTypeColors[type]}`} style={{ width: totalMB > 0 ? `${(mb / totalMB) * 100}%` : '0%' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Note */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex gap-3">
                        <svg className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <p className="text-xs text-slate-500">Storage estimates are calculated based on average file sizes: Image (0.3MB), Audio (0.15MB), Video (8MB), Document (0.5MB). Actual usage depends on your cloud storage provider (Cloudinary, AWS S3 etc.)</p>
                    </div>
                </div>
            )}
        </div>
    );
};
