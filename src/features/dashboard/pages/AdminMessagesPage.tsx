import React, { useEffect, useState } from 'react';
import { adminApi } from '../../../api/admin.api';

const typeColors: Record<string, string> = {
    TEXT: 'bg-slate-700 text-slate-300',
    IMAGE: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    AUDIO: 'bg-brand/10 text-brand border border-brand/20',
    VIDEO: 'bg-violet-500/10 text-violet-400 border border-violet-500/20',
    FILE: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    LOCATION: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
};

export const AdminMessagesPage: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {
        setLoading(true);
        adminApi.getMessages(page, 20).then((res) => {
            setData(res);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [page]);

    const totalPages = data ? Math.ceil(data.total / 20) : 1;

    return (
        <div className="p-4 sm:p-8 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Messages</h1>
                <p className="text-slate-400 text-sm mt-1">{data?.total?.toLocaleString() ?? '–'} total messages</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="w-full overflow-x-auto">
                    <table className="min-w-[1100px] w-full text-sm">
                    <thead className="border-b border-slate-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Sender</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Content</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Conversation</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Sent</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {loading ? (
                            Array.from({ length: 8 }).map((_, i) => (
                                <tr key={i}>
                                    <td colSpan={5} className="px-6 py-4">
                                        <div className="h-4 bg-slate-800 rounded animate-pulse" />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            (data?.data ?? []).map((msg: any) => (
                                <tr key={msg.id} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-brand/10 flex items-center justify-center text-brand text-[10px] font-bold overflow-hidden flex-shrink-0">
                                                {msg.sender?.profileImage ? (
                                                    <img src={msg.sender.profileImage} alt="" className="w-full h-full object-cover" />
                                                ) : msg.sender?.username?.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-slate-200 font-medium">{msg.sender?.username}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-400 max-w-xs truncate">
                                        {msg.content || (msg.mediaUrl ? <span className="italic text-slate-500">Media</span> : '—')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeColors[msg.type ?? 'TEXT'] ?? 'bg-slate-800 text-slate-400'}`}>
                                            {msg.type ?? 'TEXT'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-xs">
                                        {msg.conversation?.title || (msg.conversation?.isGroup ? 'Group' : 'DM')} #{msg.conversationId}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-xs">
                                        {new Date(msg.timestamp ?? msg.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                    </table>
                </div>
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
