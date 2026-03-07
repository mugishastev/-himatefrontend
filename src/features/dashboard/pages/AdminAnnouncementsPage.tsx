import React, { useState, useEffect } from 'react';
import { adminApi } from '../../../api/admin.api';

export const AdminAnnouncementsPage: React.FC = () => {
    const [message, setMessage] = useState('');
    const [title, setTitle] = useState('');
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [history, setHistory] = useState<any[]>([]);
    const [historyLoading, setHistoryLoading] = useState(true);

    useEffect(() => {
        adminApi.getBroadcastHistory().then((data) => {
            setHistory(data ?? []);
            setHistoryLoading(false);
        }).catch(() => setHistoryLoading(false));
    }, [sent]);

    const handleSend = async () => {
        if (!message.trim() || !title.trim()) return;
        setSending(true);
        try {
            await adminApi.sendBroadcast(title, message);
            setSent(true);
            setTitle('');
            setMessage('');
            setTimeout(() => setSent(false), 3000);
        } catch (err) {
            alert('Failed to send announcement');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="p-8 max-w-5xl">
            <h1 className="text-2xl font-bold text-white mb-2">Announcements</h1>
            <p className="text-slate-400 text-sm mb-8">Send platform-wide notifications to all users at once</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Compose */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-6">Compose Broadcast</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. New Feature: Dark Mode"
                                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Message</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Write your announcement here..."
                                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors h-36 resize-none"
                            />
                        </div>

                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex gap-3">
                            <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            <p className="text-xs text-amber-400">This will send a notification to <strong>every user</strong> on the platform. Use cautiously.</p>
                        </div>

                        <button
                            onClick={handleSend}
                            disabled={sending || !title.trim() || !message.trim()}
                            className="w-full py-3 bg-brand text-white rounded-xl font-semibold text-sm hover:bg-brand/90 transition-colors disabled:opacity-50"
                        >
                            {sent ? '✓ Sent Successfully!' : sending ? 'Sending...' : 'Send to All Users'}
                        </button>
                    </div>
                </div>

                {/* History */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-6">Broadcast History</h2>
                    {historyLoading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-16 bg-slate-800 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                            <svg className="w-10 h-10 mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                            <p className="text-sm">No broadcasts sent yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {history.map((b: any) => (
                                <div key={b.id} className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                                    <p className="font-semibold text-slate-200 text-sm">{b.title || 'Announcement'}</p>
                                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{b.details || b.content}</p>
                                    <p className="text-[10px] text-slate-600 mt-2">{new Date(b.createdAt).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
