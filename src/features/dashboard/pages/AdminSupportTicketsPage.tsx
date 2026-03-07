import React, { useState } from 'react';

type Ticket = { id: number; user: string; subject: string; status: 'Open' | 'In Progress' | 'Resolved'; date: string; preview: string };

const demoTickets: Ticket[] = [
    { id: 1, user: 'john_doe', subject: 'Cannot send voice notes', status: 'Open', date: '2026-03-07', preview: 'I am trying to record a voice message but the button does nothing...' },
    { id: 2, user: 'sarah_k', subject: 'Login issue after password reset', status: 'In Progress', date: '2026-03-06', preview: 'After resetting my password I keep getting an error when I try to log in...' },
    { id: 3, user: 'mike123', subject: 'Profile picture not updating', status: 'Resolved', date: '2026-03-05', preview: 'I uploaded a new photo but it still shows the old one...' },
];

const statusColor: Record<string, string> = {
    'Open': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    'In Progress': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    'Resolved': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
};

export const AdminSupportTicketsPage: React.FC = () => {
    const [selected, setSelected] = useState<Ticket | null>(null);
    const [reply, setReply] = useState('');

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-white mb-2">Support Tickets</h1>
            <p className="text-slate-400 text-sm mb-8">Respond to user inquiries and bug reports</p>

            <div className="flex gap-6 h-[calc(100vh-200px)]">
                {/* Ticket List */}
                <div className="w-80 flex-shrink-0 space-y-2 overflow-y-auto">
                    {demoTickets.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setSelected(t)}
                            className={`w-full text-left p-4 rounded-xl border transition-all ${selected?.id === t.id ? 'bg-brand/10 border-brand/30' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold text-slate-200 text-sm">@{t.user}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor[t.status]}`}>{t.status}</span>
                            </div>
                            <p className="text-sm text-slate-300 font-medium">{t.subject}</p>
                            <p className="text-xs text-slate-500 mt-1 truncate">{t.preview}</p>
                            <p className="text-[10px] text-slate-600 mt-2">{t.date}</p>
                        </button>
                    ))}
                </div>

                {/* Ticket Detail */}
                <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
                    {selected ? (
                        <>
                            <div className="p-6 border-b border-slate-800">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-bold text-white">{selected.subject}</h2>
                                        <p className="text-sm text-slate-400 mt-1">From @{selected.user} · {selected.date}</p>
                                    </div>
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusColor[selected.status]}`}>{selected.status}</span>
                                </div>
                            </div>
                            <div className="flex-1 p-6 overflow-y-auto">
                                <div className="bg-slate-800/50 rounded-xl p-4 max-w-2xl">
                                    <p className="text-sm text-slate-300">{selected.preview}</p>
                                </div>
                            </div>
                            <div className="p-4 border-t border-slate-800 flex gap-3">
                                <textarea
                                    value={reply}
                                    onChange={(e) => setReply(e.target.value)}
                                    placeholder="Type your reply..."
                                    className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand resize-none h-16"
                                />
                                <button
                                    disabled={!reply.trim()}
                                    className="px-5 bg-brand text-white rounded-xl font-medium text-sm hover:bg-brand/90 transition-colors disabled:opacity-50"
                                    onClick={() => { alert('Reply sent (demo)'); setReply(''); }}
                                >
                                    Reply
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                            <svg className="w-12 h-12 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                            <p className="font-medium">Select a ticket to view</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
