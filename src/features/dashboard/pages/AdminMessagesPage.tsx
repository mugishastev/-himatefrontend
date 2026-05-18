import React, { useEffect, useState } from 'react';
import { adminApi } from '../../../api/admin.api';

const typeColors: Record<string, string> = {
    TEXT: 'bg-slate-700 text-slate-350',
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
    const [selectedMessage, setSelectedMessage] = useState<any>(null);

    const fetchMessages = () => {
        setLoading(true);
        adminApi.getMessages(page, 20).then((res) => {
            setData(res);
            setLoading(false);
        }).catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchMessages();
    }, [page]);

    const handleDeleteMessage = async (msgId: number) => {
        if (!confirm('Are you sure you want to delete this message system-wide? This action is permanent.')) return;
        try {
            await adminApi.deleteMessage(msgId);
            fetchMessages();
        } catch (error) {
            console.error('Failed to delete message:', error);
            alert('Failed to delete message');
        }
    };

    const totalPages = data ? Math.ceil(data.total / 20) : 1;

    return (
        <div className="p-4 sm:p-8 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Messages</h1>
                <p className="text-slate-400 text-sm mt-1">{data?.total?.toLocaleString() ?? '–'} total active messages system-wide</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
                <div className="w-full overflow-x-auto">
                    <table className="min-w-[1100px] w-full text-sm">
                    <thead className="border-b border-slate-800 bg-slate-900/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Sender</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Content</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Conversation</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Sent</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {loading ? (
                            Array.from({ length: 8 }).map((_, i) => (
                                <tr key={i}>
                                    <td colSpan={6} className="px-6 py-4">
                                        <div className="h-4 bg-slate-800 rounded animate-pulse" />
                                    </td>
                                </tr>
                            ))
                        ) : (data?.data ?? []).length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-16 text-center text-slate-500">
                                    <svg className="w-10 h-10 mx-auto mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                    <p className="text-sm">No messages found</p>
                                </td>
                            </tr>
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
                                    <td className="px-6 py-4 text-slate-350 max-w-xs truncate font-mono text-xs">
                                        {msg.content || (msg.mediaUrl ? <span className="italic text-slate-500">Media attachment</span> : '—')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeColors[msg.type ?? 'TEXT'] ?? 'bg-slate-800 text-slate-400'}`}>
                                            {msg.type ?? 'TEXT'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-xs">
                                        {msg.conversation?.title || (msg.conversation?.isGroup ? 'Group Chat' : 'Direct Message')} #{msg.conversationId}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-xs whitespace-nowrap">
                                        {new Date(msg.timestamp ?? msg.createdAt).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                                        <button
                                            onClick={() => setSelectedMessage(msg)}
                                            className="text-xs font-bold text-brand hover:text-orange-400 bg-brand/10 hover:bg-brand/20 border border-brand/25 px-2 py-1 rounded transition-colors"
                                        >
                                            View Context
                                        </button>
                                        <button
                                            onClick={() => handleDeleteMessage(msg.id)}
                                            className="text-xs font-bold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 px-2 py-1 rounded transition-colors"
                                        >
                                            Delete System-Wide
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">Page {page} of {totalPages}</p>
                <div className="flex gap-2">
                    <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-sm disabled:opacity-40 hover:bg-slate-700 transition-colors">← Prev</button>
                    <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-sm disabled:opacity-40 hover:bg-slate-700 transition-colors">Next →</button>
                </div>
            </div>

            {/* Message Detail / Context Modal */}
            {selectedMessage && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-scale-up">
                        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                            <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                            Full Message Context
                        </h2>
                        <p className="text-xs text-slate-400 mb-6">Reviewing raw message logs and structural metadata for moderation.</p>

                        <div className="space-y-4">
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                                <div className="flex items-center gap-2 justify-between">
                                    <span className="text-xs font-semibold text-slate-500 uppercase">Sender Details</span>
                                    <span className="text-[10px] font-mono text-slate-600">ID: {selectedMessage.senderId}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-brand/10 border border-brand/20 overflow-hidden flex items-center justify-center text-brand font-bold text-sm">
                                        {selectedMessage.sender?.profileImage ? (
                                            <img src={selectedMessage.sender.profileImage} alt="" className="w-full h-full object-cover" />
                                        ) : selectedMessage.sender?.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-200">{selectedMessage.sender?.username}</p>
                                        <p className="text-xs text-slate-500">{new Date(selectedMessage.timestamp ?? selectedMessage.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                                <span className="text-xs font-semibold text-slate-500 uppercase block">Raw Message Payload</span>
                                <div className="text-sm text-slate-200 font-mono whitespace-pre-wrap break-all bg-slate-900/50 p-3 rounded-lg border border-slate-850 max-h-48 overflow-y-auto">
                                    {selectedMessage.content || <span className="text-slate-600 italic">No text content</span>}
                                </div>
                            </div>

                            {selectedMessage.mediaUrl && (
                                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                                    <span className="text-xs font-semibold text-slate-500 uppercase block">Media Attachment</span>
                                    <a href={selectedMessage.mediaUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-brand hover:underline flex items-center gap-1.5 break-all">
                                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                        {selectedMessage.mediaUrl}
                                    </a>
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button onClick={() => setSelectedMessage(null)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors">Close Context</button>
                                <button
                                    onClick={() => {
                                        const id = selectedMessage.id;
                                        setSelectedMessage(null);
                                        handleDeleteMessage(id);
                                    }}
                                    className="flex-1 py-2.5 rounded-lg text-sm font-bold bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 transition-colors"
                                >
                                    Delete Message
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
