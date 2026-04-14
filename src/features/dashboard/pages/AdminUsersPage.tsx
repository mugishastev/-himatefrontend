import React, { useEffect, useState } from 'react';
import { adminApi } from '../../../api/admin.api';

const RoleBadge: React.FC<{ isAdmin: boolean }> = ({ isAdmin }) => (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${isAdmin ? 'text-brand border-brand/20 bg-brand/10' : 'text-slate-400 border-slate-700 bg-slate-800'}`}>
        {isAdmin ? 'ADMIN' : 'USER'}
    </span>
);

const VerifiedBadge: React.FC<{ isVerified: boolean, isBanned: boolean }> = ({ isVerified, isBanned }) => {
    if (isBanned) {
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border text-red-400 border-red-500/20 bg-red-500/10">Banned</span>;
    }
    return (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${isVerified ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' : 'text-slate-500 border-slate-700 bg-slate-800'}`}>
            {isVerified ? 'Verified' : 'Unverified'}
        </span>
    );
};

export const AdminUsersPage: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [banModalVisible, setBanModalVisible] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [banReason, setBanReason] = useState('');

    const fetchUsers = () => {
        setLoading(true);
        const request = search
            ? adminApi.searchUsers(search, page, 20)
            : adminApi.getUsers(page, 20);

        request.then((res) => {
            setData(res);
            setLoading(false);
        }).catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchUsers();
    }, [page, search]);

    const handleBanClick = (userId: number) => {
        setSelectedUserId(userId);
        setBanReason('');
        setBanModalVisible(true);
    };

    const handleConfirmBan = async () => {
        if (!selectedUserId || !banReason.trim()) return;
        try {
            await adminApi.banUser(selectedUserId, banReason);
            setBanModalVisible(false);
            fetchUsers();
        } catch (error) {
            console.error('Failed to ban user:', error);
            alert('Failed to ban user. They may be an admin.');
        }
    };

    const handleUnbanClick = async (userId: number) => {
        if (!confirm('Are you sure you want to unban this user?')) return;
        try {
            await adminApi.unbanUser(userId);
            fetchUsers();
        } catch (error) {
            console.error('Failed to unban user:', error);
        }
    };

    const totalPages = Math.max(1, data && typeof data.total === 'number' ? Math.ceil(data.total / 20) : 1);

    return (
        <div className="p-4 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Users</h1>
                    <p className="text-slate-400 text-sm mt-1">{data?.total?.toLocaleString() ?? '–'} registered users</p>
                </div>
                {/* Search */}
                <form onSubmit={(e) => { e.preventDefault(); setPage(1); setSearch(searchInput); }} className="flex gap-2 w-full sm:w-auto">
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search by name or email..."
                        className="flex-1 sm:w-64 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-brand"
                    />
                    <button type="submit" className="px-4 py-2 bg-brand/15 hover:bg-brand/25 text-brand font-medium rounded-lg text-sm transition-colors border border-brand/20">
                        Search
                    </button>
                </form>
            </div>

            {/* Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="w-full overflow-x-auto">
                    <table className="min-w-[900px] w-full text-sm">
                    <thead className="border-b border-slate-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined</th>
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
                        ) : (
                            (data?.data ?? []).map((user: any) => (
                                <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-brand/10 border border-brand/20 overflow-hidden flex items-center justify-center text-brand font-bold text-xs flex-shrink-0">
                                                {user.profileImage ? (
                                                    <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
                                                ) : user.username?.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-medium text-slate-200">{user.username}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-400">{user.email}</td>
                                    <td className="px-6 py-4"><RoleBadge isAdmin={user.isAdmin} /></td>
                                    <td className="px-6 py-4"><VerifiedBadge isVerified={user.isVerified} isBanned={user.isBanned} /></td>
                                    <td className="px-6 py-4 text-slate-500 text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        {!user.isAdmin && (
                                            user.isBanned ? (
                                                <button onClick={() => handleUnbanClick(user.id)} className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors">Unban</button>
                                            ) : (
                                                <button onClick={() => handleBanClick(user.id)} className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors">Suspend</button>
                                            )
                                        )}
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

            {/* Ban Modal */}
            {banModalVisible && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold text-white mb-2">Suspend User</h2>
                        <p className="text-sm text-slate-400 mb-6">This will immediately log the user out and prevent them from accessing the platform until unbanned.</p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Reason for suspension</label>
                                <textarea
                                    value={banReason}
                                    onChange={(e) => setBanReason(e.target.value)}
                                    placeholder="e.g. Violation of community guidelines"
                                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 transition-colors h-24 resize-none text-sm"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button onClick={() => setBanModalVisible(false)} className="flex-1 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors">Cancel</button>
                                <button
                                    onClick={handleConfirmBan}
                                    disabled={!banReason.trim()}
                                    className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-colors disabled:opacity-50"
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
