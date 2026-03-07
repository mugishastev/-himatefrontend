import React, { useEffect, useState } from 'react';
import { adminApi } from '../../../api/admin.api';

const ACTION_COLORS: Record<string, string> = {
    LOGIN: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    LOGOUT: 'text-slate-400 bg-slate-800 border-slate-700',
    USER_BANNED: 'text-red-400 bg-red-500/10 border-red-500/20',
    USER_UNBANNED: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    BROADCAST_SENT: 'text-brand bg-brand/10 border-brand/20',
    RESET_PASSWORD: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    REGISTER: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
};

const ACTION_TYPES = ['ALL', 'LOGIN', 'USER_BANNED', 'USER_UNBANNED', 'BROADCAST_SENT', 'RESET_PASSWORD', 'REGISTER'];

export const AdminReportsPage: React.FC = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [actionFilter, setActionFilter] = useState('ALL');

    const fetchLogs = (p = 1, action = actionFilter) => {
        setLoading(true);
        adminApi.getAuditLogs(p, 30, action === 'ALL' ? undefined : action)
            .then((res) => {
                setLogs(res.data ?? []);
                setTotal(res.total ?? 0);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => { fetchLogs(1, actionFilter); }, [actionFilter]);
    useEffect(() => { fetchLogs(page, actionFilter); }, [page]);

    const totalPages = Math.ceil(total / 30) || 1;

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Audit Logs</h1>
                    <p className="text-slate-400 text-sm mt-1">{total.toLocaleString()} total admin & platform actions recorded</p>
                </div>

                {/* Action filter */}
                <div className="flex flex-wrap gap-2">
                    {ACTION_TYPES.map((a) => (
                        <button
                            key={a}
                            onClick={() => { setPage(1); setActionFilter(a); }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${actionFilter === a ? 'bg-brand/15 text-brand border-brand/30' : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'}`}
                        >
                            {a.replace(/_/g, ' ')}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="border-b border-slate-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Details</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {loading ? (
                            Array.from({ length: 10 }).map((_, i) => (
                                <tr key={i}><td colSpan={4} className="px-6 py-4"><div className="h-4 bg-slate-800 rounded animate-pulse" /></td></tr>
                            ))
                        ) : logs.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-16 text-center text-slate-500">
                                    <svg className="w-10 h-10 mx-auto mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    <p className="text-sm">No audit logs found</p>
                                </td>
                            </tr>
                        ) : (
                            logs.map((log: any) => (
                                <tr key={log.id} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ACTION_COLORS[log.action] ?? 'text-slate-400 bg-slate-800 border-slate-700'}`}>
                                            {log.action.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {log.user ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-brand/10 flex items-center justify-center text-brand text-[10px] font-bold overflow-hidden flex-shrink-0">
                                                    {log.user.profileImage ? <img src={log.user.profileImage} alt="" className="w-full h-full object-cover" /> : log.user.username?.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-slate-300 text-sm">{log.user.username}</span>
                                            </div>
                                        ) : (
                                            <span className="text-slate-600 text-sm">System</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-slate-400 text-sm max-w-xs truncate">{log.details || '—'}</td>
                                    <td className="px-6 py-4 text-slate-500 text-xs whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">Page {page} of {totalPages} · {total.toLocaleString()} records</p>
                <div className="flex gap-2">
                    <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-sm disabled:opacity-40 hover:bg-slate-700 transition-colors">← Prev</button>
                    <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-sm disabled:opacity-40 hover:bg-slate-700 transition-colors">Next →</button>
                </div>
            </div>
        </div>
    );
};
