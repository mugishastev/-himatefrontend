import React, { useEffect, useState } from 'react';
import { adminApi } from '../../../api/admin.api';
import { conversationsApi } from '../../../api/conversations.api';
import { messagesApi } from '../../../api/messages.api';

type Ticket = { id: number; user: string; subject: string; status: 'Open' | 'In Progress' | 'Resolved'; date: string; preview: string };

export const AdminSupportTicketsPage: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [selected, setSelected] = useState<Ticket | null>(null);
    const [selectedConversation, setSelectedConversation] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [reply, setReply] = useState('');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        setLoading(true);
        adminApi.getConversations(1, 50).then((res) => {
            const conversations = res.data ?? [];
            const pageConvos = conversations.filter((c: any) => c.pageId != null);
            const mapped = pageConvos.map((c: any) => ({
                id: c.id,
                user: c.participants?.[0]?.user?.username || 'unknown',
                subject: c.title || 'Page Inquiry',
                status: 'Open' as const,
                date: new Date(c.createdAt).toLocaleDateString(),
                preview: c.messages?.[0]?.content || 'No messages yet',
            }));
            setTickets(mapped);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const loadConversation = async (ticket: Ticket) => {
        setSelected(ticket);
        try {
            const convo = await conversationsApi.getConversationDetails(ticket.id);
            setSelectedConversation(convo);
        } catch {
            setSelectedConversation(null);
        }
    };

    const handleSendReply = async () => {
        if (!selected || !reply.trim() || sending) return;
        setSending(true);
        try {
            await messagesApi.sendMessage({
                conversationId: Number(selected.id),
                content: reply.trim(),
                type: 'TEXT',
            });
            setReply('');
            const convo = await conversationsApi.getConversationDetails(selected.id);
            setSelectedConversation(convo);
        } catch (err) {
            console.error('Failed to send reply', err);
            alert('Failed to send reply.');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="p-4 sm:p-8">
            <h1 className="text-2xl font-bold text-white mb-2">Support Tickets</h1>
            <p className="text-slate-400 text-sm mb-8">Manage incoming user support tickets and bug reports.</p>

            <div className="flex flex-col md:flex-row gap-6 md:h-[calc(100vh-200px)] min-h-0">
                {/* Ticket List */}
                <div className={`w-full md:w-80 flex-shrink-0 space-y-2 overflow-y-auto ${selected ? 'hidden md:block' : ''}`}>
                    {loading ? (
                        <div className="text-sm text-slate-500 p-4">Loading tickets...</div>
                    ) : tickets.length > 0 ? (
                        tickets.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => loadConversation(t)}
                                className={`w-full text-left p-4 rounded-xl border transition-all ${selected?.id === t.id ? 'bg-brand/10 border-brand/30' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-semibold text-slate-200 text-sm">@{t.user}</span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border text-amber-400 bg-amber-500/10 border-amber-500/20">{t.status}</span>
                                </div>
                                <p className="text-sm text-slate-300 font-medium">{t.subject}</p>
                                <p className="text-xs text-slate-500 mt-1 truncate">{t.preview}</p>
                                <p className="text-[10px] text-slate-600 mt-2">{t.date}</p>
                            </button>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-900/50 border border-slate-800 border-dashed rounded-2xl">
                            <svg className="w-10 h-10 text-slate-700 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <p className="text-slate-500 text-sm font-medium">No support tickets found.</p>
                        </div>
                    )}
                </div>

                {/* Ticket Detail */}
                <div className={`flex-1 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden min-h-[60vh] md:min-h-0 ${selected ? 'flex' : 'hidden md:flex'}`}>
                    {selected ? (
                        <>
                            <div className="p-6 border-b border-slate-800">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelected(null);
                                                setSelectedConversation(null);
                                            }}
                                            className="md:hidden mb-3 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                            </svg>
                                            Back to tickets
                                        </button>
                                        <h2 className="text-lg font-bold text-white">{selected.subject}</h2>
                                        <p className="text-sm text-slate-400 mt-1">From @{selected.user} - {selected.date}</p>
                                    </div>
                                    <span className="text-xs font-bold px-3 py-1 rounded-full border text-amber-400 bg-amber-500/10 border-amber-500/20">{selected.status}</span>
                                </div>
                            </div>
                            <div className="flex-1 p-6 overflow-y-auto">
                                {(selectedConversation?.messages ?? []).length > 0 ? (
                                    <div className="space-y-3">
                                        {selectedConversation.messages.map((m: any) => (
                                            <div key={m.id} className="bg-slate-800/50 rounded-xl p-4 max-w-2xl">
                                                <p className="text-xs text-slate-500 mb-1">{m.sender?.username ?? 'User'} - {new Date(m.timestamp).toLocaleString()}</p>
                                                <p className="text-sm text-slate-300">{m.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-slate-800/50 rounded-xl p-4 max-w-2xl">
                                        <p className="text-sm text-slate-300">{selected.preview}</p>
                                    </div>
                                )}
                            </div>
                            <div className="p-4 border-t border-slate-800 flex gap-3">
                                <textarea
                                    value={reply}
                                    onChange={(e) => setReply(e.target.value)}
                                    placeholder="Type your reply..."
                                    className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand resize-none h-16"
                                />
                                <button
                                    disabled={!reply.trim() || sending}
                                    className="px-5 bg-brand text-white rounded-xl font-medium text-sm hover:bg-brand/90 transition-colors disabled:opacity-50"
                                    onClick={handleSendReply}
                                >
                                    {sending ? 'Sending...' : 'Reply'}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                            <svg className="w-12 h-12 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                            <p className="font-medium">Select a ticket to view</p>
                            <p className="text-xs text-slate-600 mt-1">Real-time ticket processing enabled.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
