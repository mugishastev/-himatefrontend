import React, { useEffect, useState } from 'react';
import { adminApi } from '../../../api/admin.api';

export const AdminBannedUsersPage: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');

    const fetchBanned = () => {
        setLoading(true);
        adminApi.getUsers(page, 20, search || undefined, true).then((res) => {
            setData(res);
            setLoading(false);
        }).catch(() => setLoading(false));
    };

    useEffect(() => { fetchBanned(); }, [page, search]);

    const handleUnban = async (userId: number) => {
        if (!confirm('Lift the ban for this user?')) return;
        try {
            await adminApi.unbanUser(userId);
            fetchBanned();
        } catch (e) { console.error(e); }
    };

    return (
        <div className="p-4 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Banned Users</h1>
                    <p className="text-slate-400 text-sm mt-1">Users who have been suspended from the platform</p>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); setPage(1); setSearch(searchInput); }} className="flex gap-2 w-full sm:w-auto">
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search banned users..."
                        className="flex-1 sm:w-64 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-red-500"
                    />
                    <button type="submit" className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium rounded-lg text-sm transition-colors border border-red-500/20">Search</button>
                </form>
            </div>

            {data?.data?.length === 0 && !loading ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-16 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-400">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <p className="text-xl font-semibold text-slate-200">No banned users</p>
                    <p className="text-sm text-slate-500 mt-1">The platform community is in good standing</p>
                </div>
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="w-full overflow-x-auto">
                        <table className="min-w-[900px] w-full text-sm">
                        <thead className="border-b border-slate-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Reason</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}><td colSpan={4} className="px-6 py-4"><div className="h-4 bg-slate-800 rounded animate-pulse" /></td></tr>
                                ))
                            ) : (
                                (data?.data ?? []).map((user: any) => (
                                    <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 overflow-hidden flex items-center justify-center text-red-400 font-bold text-xs flex-shrink-0">
                                                    {user.profileImage ? <img src={user.profileImage} alt="" className="w-full h-full object-cover" /> : user.username?.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-medium text-slate-200">{user.username}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className="text-red-400 text-xs bg-red-500/10 px-2 py-1 rounded-lg border border-red-500/20">
                                                {user.banReason || 'No reason provided'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleUnban(user.id)}
                                                className="text-sm font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg transition-colors border border-emerald-500/20"
                                            >
                                                Unban
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination */}
                    {data && data.total > 20 && (
                        <div className="p-4 border-t border-slate-800 flex items-center justify-between">
                            <p className="text-xs text-slate-500">Showing {data.data.length} of {data.total} banned users</p>
                            <div className="flex gap-2">
                                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 rounded bg-slate-800 text-slate-400 text-xs disabled:opacity-40 hover:bg-slate-700 transition-colors">← Prev</button>
                                <button disabled={page * 20 >= data.total} onClick={() => setPage(p => p + 1)} className="px-3 py-1 rounded bg-slate-800 text-slate-400 text-xs disabled:opacity-40 hover:bg-slate-700 transition-colors">Next →</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
