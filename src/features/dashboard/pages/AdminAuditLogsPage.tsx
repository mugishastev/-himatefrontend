import React, { useEffect, useState } from 'react';
import { adminApi } from '../../../api/admin.api';

// Categories matching our Prisma database structure
const LOG_CATEGORIES = [
    { id: 'all', label: 'All Logs', color: 'bg-slate-800 text-slate-300 border-slate-700' },
    { id: 'session', label: 'Session & Auth', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    { id: 'admin', label: 'Admin Actions', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
    { id: 'high-risk', label: 'High-Risk Activity', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
];

export const AdminAuditLogsPage: React.FC = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchLogs = async (p: number) => {
        setLoading(true);
        try {
            const catParam = filter !== 'all' ? filter : undefined;
            const searchParam = searchQuery.trim() !== '' ? searchQuery : undefined;
            const response = await adminApi.getAuditLogs(p, 15, undefined, catParam, searchParam);
            
            if (response && Array.isArray(response.data)) {
                setLogs(response.data);
                const limit = response.limit || 15;
                const total = response.total || 0;
                setTotalPages(Math.ceil(total / limit) || 1);
            } else if (Array.isArray(response)) {
                setLogs(response);
                setTotalPages(1);
            }
        } catch (error) {
            console.error('Failed to fetch audit logs', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchLogs(page);
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [page, filter, searchQuery]);

    const getIconForCategory = (cat: string) => {
        switch (cat) {
            case 'session':
                return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>;
            case 'admin':
                return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
            case 'high-risk':
                return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
            default:
                return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
        }
    };

    const getBadgeStyle = (cat: string) => {
        switch (cat) {
            case 'session': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'admin': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
            case 'high-risk': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-slate-800 text-slate-300 border-slate-700';
        }
    };

    const getCategoryLabel = (cat: string) => {
        switch (cat) {
            case 'session': return 'Session & Auth';
            case 'admin': return 'Admin Action';
            case 'high-risk': return 'High-Risk';
            default: return cat ? cat.toUpperCase() : 'General';
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setPage(1);
    };

    return (
        <div className="p-4 sm:p-8 flex flex-col h-full overflow-hidden">
            <div className="shrink-0 mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        System Audit Logs
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Track all critical system activity and security events from real database records.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <input
                            type="text"
                            placeholder="Search logs..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="w-full sm:w-64 bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors"
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-4 shrink-0 no-scrollbar">
                {LOG_CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => { setFilter(cat.id); setPage(1); }}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                            filter === cat.id 
                            ? cat.color
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                        }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col min-h-0">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-950/50 sticky top-0 z-10 backdrop-blur-sm">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">Event Type</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">Actor</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">IP Address</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">Timestamp</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                                            Loading audit logs...
                                        </div>
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        No audit logs found for this filter.
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log: any, index: number) => {
                                    const cat = log.category || 'general';
                                    const actorName = log.user?.username || 'System';
                                    const actorEmail = log.user?.email || '';
                                    return (
                                        <tr key={log.id || index} className="hover:bg-slate-800/50 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${getBadgeStyle(cat)}`}>
                                                        {getIconForCategory(cat)}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-slate-200">{log.action || 'Unknown Action'}</span>
                                                        <span className="text-[10px] text-slate-500">{getCategoryLabel(cat)}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    {log.user ? (
                                                        <>
                                                            <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400 border border-slate-700">
                                                                {actorName.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-sm text-slate-300 font-medium">{actorName}</span>
                                                                <span className="text-[10px] text-slate-500">{actorEmail}</span>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <span className="text-sm text-slate-500 italic">System</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                                                    {log.ipAddress || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-slate-300">
                                                    {new Date(log.createdAt).toLocaleDateString()}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {new Date(log.createdAt).toLocaleTimeString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-slate-400 max-w-xs md:max-w-md break-words" title={log.details}>
                                                    {log.details || '-'}
                                                </p>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/50">
                    <span className="text-sm text-slate-500">
                        Page {page} of {totalPages}
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
