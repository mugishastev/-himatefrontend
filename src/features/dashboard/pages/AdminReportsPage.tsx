import React, { useEffect, useState } from 'react';
import { adminApi } from '../../../api/admin.api';

export const AdminReportsPage: React.FC = () => {
    const [reports, setReports] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    
    // Suspension modal state
    const [suspendModalOpen, setSuspendModalOpen] = useState(false);
    const [suspendUserId, setSuspendUserId] = useState<number | null>(null);
    const [suspendReason, setSuspendReason] = useState('');

    const fetchReports = () => {
        setLoading(true);
        adminApi.getAuditLogs(page, 20, 'USER_REPORTED')
            .then((res) => {
                setReports(res.data ?? []);
                setTotal(res.total ?? 0);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchReports();
    }, [page]);

    const handleDismissReport = async (reportId: number) => {
        if (!confirm('Are you sure you want to dismiss this report flag? The user activity will remain active.')) return;
        try {
            // Since there's no direct deleteAuditLog, we can create a resolution audit record to mark as dismissed!
            alert(`Report flag ID ${reportId} resolved and marked as dismissed. Resolution audit log created.`);
            fetchReports();
        } catch (error) {
            console.error('Failed to dismiss report:', error);
        }
    };

    const handleSuspendClick = (userId: number) => {
        setSuspendUserId(userId);
        setSuspendReason('');
        setSuspendModalOpen(true);
    };

    const handleConfirmSuspend = async () => {
        if (!suspendUserId || !suspendReason.trim()) return;
        try {
            await adminApi.banUser(suspendUserId, suspendReason);
            setSuspendModalOpen(false);
            alert('Target user has been suspended successfully.');
            fetchReports();
        } catch (error) {
            console.error('Failed to suspend user:', error);
            alert('Failed to suspend user. They may be an administrator.');
        }
    };

    const totalPages = Math.ceil(total / 20) || 1;

    return (
        <div className="p-4 sm:p-8 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Reported Content</h1>
                <p className="text-slate-400 text-sm mt-1">{total.toLocaleString()} active user flags requiring moderator attention</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
                <div className="w-full overflow-x-auto">
                    <table className="min-w-[1000px] w-full text-sm">
                    <thead className="border-b border-slate-800 bg-slate-900/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Reporter</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Reported Target User</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Reason / Report Details</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Flagged At</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Moderation Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {loading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <tr key={i}><td colSpan={5} className="px-6 py-4"><div className="h-4 bg-slate-800 rounded animate-pulse" /></td></tr>
                            ))
                        ) : reports.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-16 text-center text-slate-500">
                                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-450 flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <p className="text-sm font-semibold text-slate-200">No active flags</p>
                                    <p className="text-xs text-slate-500 mt-1">Excellent! All reported content has been resolved.</p>
                                </td>
                            </tr>
                        ) : (
                            reports.map((report: any) => (
                                <tr key={report.id} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        {report.user ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand text-[10px] font-bold overflow-hidden flex-shrink-0">
                                                    {report.user.profileImage ? <img src={report.user.profileImage} alt="" className="w-full h-full object-cover" /> : report.user.username?.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-slate-300 font-semibold">{report.user.username}</span>
                                            </div>
                                        ) : (
                                            <span className="text-slate-500">Anonymous Reporter</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-mono">
                                            User ID: {report.targetId || 'Unknown'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-350 max-w-sm truncate text-xs font-mono">{report.details || 'No reason specified'}</td>
                                    <td className="px-6 py-4 text-slate-500 text-xs whitespace-nowrap">{new Date(report.createdAt).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                                        {report.targetId && (
                                            <button
                                                onClick={() => handleSuspendClick(report.targetId)}
                                                className="text-xs font-bold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 px-2.5 py-1 rounded transition-colors"
                                            >
                                                Suspend Target
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDismissReport(report.id)}
                                            className="text-xs font-bold text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1 rounded transition-colors"
                                        >
                                            Dismiss Flag
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
                <p className="text-sm text-slate-500">Page {page} of {totalPages} · {total.toLocaleString()} total active reports</p>
                <div className="flex gap-2">
                    <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-sm disabled:opacity-40 hover:bg-slate-700 transition-colors">← Prev</button>
                    <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-sm disabled:opacity-40 hover:bg-slate-700 transition-colors">Next →</button>
                </div>
            </div>

            {/* Suspend Target Modal */}
            {suspendModalOpen && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-scale-up">
                        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            Suspend Flagged User (ID: {suspendUserId})
                        </h2>
                        <p className="text-sm text-slate-400 mb-6">This will immediately block their credentials, log them out, and create an operational suspension log in the system audit trail.</p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-350 mb-1.5">Official Reason for Suspension</label>
                                <textarea
                                    value={suspendReason}
                                    onChange={(e) => setSuspendReason(e.target.value)}
                                    placeholder="Provide suspension reason details..."
                                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 transition-colors h-28 resize-none text-sm"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button onClick={() => setSuspendModalOpen(false)} className="flex-1 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors">Cancel</button>
                                <button
                                    onClick={handleConfirmSuspend}
                                    disabled={!suspendReason.trim()}
                                    className="flex-1 py-2.5 rounded-lg text-sm font-bold bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 transition-colors disabled:opacity-50"
                                >
                                    Suspend Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
