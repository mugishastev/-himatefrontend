import React, { useEffect, useState } from 'react';
import { adminApi } from '../../../api/admin.api';

export const AdminConversationsPage: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {
        setLoading(true);
        adminApi.getConversations(page, 20).then((res) => {
            setData(res);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [page]);

    const totalPages = data ? Math.ceil(data.total / 20) : 1;

    return (
        <div className="p-8 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Conversations</h1>
                <p className="text-slate-400 text-sm mt-1">{data?.total?.toLocaleString() ?? '–'} total conversations</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="border-b border-slate-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name / Type</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Participants</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Messages</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Created</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {loading ? (
                            Array.from({ length: 8 }).map((_, i) => (
                                <tr key={i}>
                                    <td colSpan={4} className="px-6 py-4">
                                        <div className="h-4 bg-slate-800 rounded animate-pulse" />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            (data?.data ?? []).map((conv: any) => (
                                <tr key={conv.id} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${conv.isGroup ? 'text-violet-400 border-violet-500/20 bg-violet-500/10' : 'text-brand border-brand/20 bg-brand/10'}`}>
                                                {conv.isGroup ? 'GROUP' : 'DM'}
                                            </span>
                                            <span className="text-slate-200 font-medium">{conv.title || 'Direct Message'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex -space-x-1.5">
                                            {(conv.participants ?? []).slice(0, 4).map((p: any) => (
                                                <div key={p.id} className="w-7 h-7 rounded-full bg-brand/10 border border-slate-900 overflow-hidden flex items-center justify-center text-[10px] font-bold text-brand flex-shrink-0">
                                                    {p.user?.profileImage ? (
                                                        <img src={p.user.profileImage} alt="" className="w-full h-full object-cover" />
                                                    ) : p.user?.username?.charAt(0).toUpperCase()}
                                                </div>
                                            ))}
                                            {conv.participants?.length > 4 && (
                                                <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-900 flex items-center justify-center text-[10px] text-slate-400 font-bold">
                                                    +{conv.participants.length - 4}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-300 font-medium">{conv._count?.messages?.toLocaleString() ?? 0}</td>
                                    <td className="px-6 py-4 text-slate-500 text-xs">{new Date(conv.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">Page {page} of {totalPages}</p>
                <div className="flex gap-2">
                    <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-sm disabled:opacity-40 hover:bg-slate-700 transition-colors">← Prev</button>
                    <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-sm disabled:opacity-40 hover:bg-slate-700 transition-colors">Next →</button>
                </div>
            </div>
        </div>
    );
};
