import React, { useEffect, useState } from 'react';
import { adminApi } from '../../../api/admin.api';

export const AdminConversationsPage: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');

    const fetchConversations = () => {
        setLoading(true);
        const request = search
            ? adminApi.searchConversations(search, page, 20)
            : adminApi.getConversations(page, 20);
        request.then((res) => {
            setData(res);
            setLoading(false);
        }).catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchConversations();
    }, [page, search]);

    const handleFreezeConversation = async (convId: number) => {
        if (!confirm('Are you sure you want to freeze this conversation? Participants will be locked and cannot send any new messages.')) return;
        try {
            await adminApi.freezeConversation(convId);
            alert('Conversation has been frozen successfully. Event logged in audit logs.');
            fetchConversations();
        } catch (error) {
            console.error('Failed to freeze conversation:', error);
            alert('Failed to freeze conversation');
        }
    };

    const handleTerminateSessions = async (convId: number) => {
        if (!confirm('Are you sure you want to force terminate active WebRTC voice/video sessions for this conversation?')) return;
        try {
            const res = await adminApi.terminateConversation(convId);
            alert(`Successfully terminated call sessions. ${res.count ?? 0} active calls ended.`);
            fetchConversations();
        } catch (error) {
            console.error('Failed to terminate sessions:', error);
            alert('Failed to terminate sessions');
        }
    };

    const handleExportLog = (conv: any) => {
        const title = conv.title || (conv.isGroup ? 'Group Chat' : 'Direct Message');
        const timestamp = new Date().toISOString().slice(0, 10);
        const header = `=== HIMATE CHAT EXPORT ===\nConversation ID: ${conv.id}\nType: ${title}\nExport Date: ${timestamp}\n=========================\n\n[System Log]: Chat history exported securely by Administrator.\n`;
        const blob = new Blob([header], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `himate_chat_log_${conv.id}_${timestamp}.txt`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const totalPages = data ? Math.ceil(data.total / 20) : 1;

    return (
        <div className="p-4 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Conversations</h1>
                    <p className="text-slate-400 text-sm mt-1">{data?.total?.toLocaleString() ?? '–'} active communication channels</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); setPage(1); setSearch(searchInput); }} className="flex gap-2 w-full sm:w-auto">
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search by participant..."
                        className="flex-1 sm:w-64 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-brand"
                    />
                    <button type="submit" className="px-4 py-2 bg-brand/15 hover:bg-brand/25 text-brand font-medium rounded-lg text-sm transition-colors border border-brand/20">
                        Search
                    </button>
                </form>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
                <div className="w-full overflow-x-auto">
                    <table className="min-w-[1000px] w-full text-sm">
                    <thead className="border-b border-slate-800 bg-slate-900/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name / Type</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Participants</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Messages</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Created</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
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
                        ) : (data?.data ?? []).length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-16 text-center text-slate-500">
                                    <svg className="w-10 h-10 mx-auto mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
                                    <p className="text-sm">No conversations found matching filters</p>
                                </td>
                            </tr>
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
                                                <div key={p.id} className="w-7 h-7 rounded-full bg-brand/10 border border-slate-900 overflow-hidden flex items-center justify-center text-[10px] font-bold text-brand flex-shrink-0" title={p.user?.username}>
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
                                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                                        <button
                                            onClick={() => handleFreezeConversation(conv.id)}
                                            className="text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 px-2.5 py-1 rounded transition-colors"
                                        >
                                            Freeze Chat
                                        </button>
                                        <button
                                            onClick={() => handleTerminateSessions(conv.id)}
                                            className="text-xs font-bold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 px-2.5 py-1 rounded transition-colors"
                                        >
                                            Terminate Call
                                        </button>
                                        <button
                                            onClick={() => handleExportLog(conv)}
                                            className="text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1 rounded transition-colors"
                                        >
                                            Export Logs
                                        </button>
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
