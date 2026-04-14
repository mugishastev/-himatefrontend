import React, { useEffect, useState } from 'react';
import { adminApi } from '../../../api/admin.api';

interface StatCardProps {
    label: string;
    value: number | string;
    subLabel?: string;
    icon: React.ReactNode;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, subLabel, icon, color }) => (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-start gap-4 hover:border-slate-700 transition-colors">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-slate-400 text-sm font-medium">{label}</p>
            <p className="text-2xl font-bold text-white mt-0.5">{Number(value).toLocaleString()}</p>
            {subLabel && <p className="text-xs text-slate-500 mt-1">{subLabel}</p>}
        </div>
    </div>
);

const BAR_MAX_HEIGHT = 80;

const ActivityChart: React.FC<{ data: { date: string; messages: number }[] }> = ({ data }) => {
    const max = Math.max(...data.map((d) => d.messages), 1);
    return (
        <div className="flex items-end gap-3 h-22.5">
            {data.map((d) => (
                <div key={d.date} className="flex flex-col items-center gap-1 flex-1 group">
                    <div
                        className="w-full bg-brand/70 hover:bg-brand rounded-t-md transition-all relative group"
                        style={{ height: `${Math.max(4, (d.messages / max) * BAR_MAX_HEIGHT)}px` }}
                    >
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {d.messages}
                        </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">{d.date}</span>
                </div>
            ))}
        </div>
    );
};

export const AdminOverviewPage: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [health, setHealth] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([adminApi.getStats(), adminApi.getHealth()])
            .then(([statsData, healthData]) => {
                setStats(statsData);
                setHealth(healthData);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-dvh">
                <div className="text-brand animate-pulse text-xl font-bold">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-8 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Platform Overview</h1>
                <p className="text-slate-400 text-sm mt-1">Real-time metrics for the Himate platform</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Total Users"
                    value={stats?.users?.total ?? 0}
                    subLabel={`+${stats?.users?.today ?? 0} today · +${stats?.users?.thisWeek ?? 0} this week`}
                    color="bg-blue-500/10 text-blue-400"
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                />
                <StatCard
                    label="Total Messages"
                    value={stats?.messages?.total ?? 0}
                    subLabel={`${stats?.messages?.today ?? 0} messages today`}
                    color="bg-brand/10 text-brand"
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>}
                />
                <StatCard
                    label="Conversations"
                    value={stats?.conversations?.total ?? 0}
                    subLabel={`${stats?.conversations?.groups ?? 0} groups · ${stats?.conversations?.dms ?? 0} DMs`}
                    color="bg-violet-500/10 text-violet-400"
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>}
                />
                <StatCard
                    label="Media Shared"
                    value={(stats?.messages?.media?.images ?? 0) + (stats?.messages?.media?.audio ?? 0) + (stats?.messages?.media?.video ?? 0) + (stats?.messages?.media?.files ?? 0)}
                    subLabel={`${stats?.messages?.media?.images ?? 0} images · ${stats?.messages?.media?.audio ?? 0} audio · ${stats?.messages?.media?.files ?? 0} files`}
                    color="bg-amber-500/10 text-amber-400"
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                />
            </div>

            {/* Health + Engagement */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-base font-semibold text-slate-200 mb-4">System Health</h2>
                    <div className="space-y-3 text-sm">
                        {[
                            { label: 'Database', ok: health?.database?.ok },
                            { label: 'Redis', ok: health?.redis?.ok },
                            { label: 'Firebase', ok: health?.firebase?.configured },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center justify-between">
                                <span className="text-slate-400">{item.label}</span>
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${item.ok ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' : 'text-red-400 border-red-500/20 bg-red-500/10'}`}>
                                    {item.ok ? 'Healthy' : 'Degraded'}
                                </span>
                            </div>
                        ))}
                        {health?.timestamp && (
                            <p className="text-[10px] text-slate-500 mt-2">Last check: {new Date(health.timestamp).toLocaleString()}</p>
                        )}
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-base font-semibold text-slate-200 mb-4">User Health</h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400">Verified</span>
                            <span className="text-slate-200 font-semibold">{(stats?.users?.verified ?? 0).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400">Unverified</span>
                            <span className="text-slate-200 font-semibold">{(stats?.users?.unverified ?? 0).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400">Banned</span>
                            <span className="text-red-300 font-semibold">{(stats?.users?.banned ?? 0).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400">Bans Today</span>
                            <span className="text-red-300 font-semibold">{(stats?.moderation?.bansToday ?? 0).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400">Active 24h</span>
                            <span className="text-slate-200 font-semibold">{(stats?.users?.active?.last24h ?? 0).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-base font-semibold text-slate-200 mb-4">Engagement</h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400">Pending Inboxes</span>
                            <span className="text-slate-200 font-semibold">{(stats?.engagement?.pendingInboxConversations ?? 0).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400">Page Inbox</span>
                            <span className="text-slate-200 font-semibold">{(stats?.engagement?.pageInboxConversations ?? 0).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400">Avg Response (min)</span>
                            <span className="text-slate-200 font-semibold">
                                {stats?.engagement?.avgResponseTimeMinutes != null ? stats.engagement.avgResponseTimeMinutes.toFixed(1) : '-'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400">Failed Notifications (24h)</span>
                            <span className="text-amber-300 font-semibold">{(stats?.notifications?.failedToday ?? 0).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Activity Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-base font-semibold text-slate-200 mb-6">7-Day Message Activity</h2>
                {stats?.weeklyActivity && <ActivityChart data={stats.weeklyActivity} />}
            </div>

            {/* Media Breakdown + Recent Users */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Media Breakdown */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-base font-semibold text-slate-200 mb-4">Media Breakdown</h2>
                    <div className="space-y-3">
                        {[
                            { label: 'Images', value: stats?.messages?.media?.images ?? 0, color: 'bg-blue-500', total: stats?.messages?.total || 1 },
                            { label: 'Audio / Voice Notes', value: stats?.messages?.media?.audio ?? 0, color: 'bg-brand', total: stats?.messages?.total || 1 },
                            { label: 'Videos', value: stats?.messages?.media?.video ?? 0, color: 'bg-violet-500', total: stats?.messages?.total || 1 },
                            { label: 'Documents', value: stats?.messages?.media?.files ?? 0, color: 'bg-amber-500', total: stats?.messages?.total || 1 },
                        ].map((item) => (
                            <div key={item.label}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm text-slate-400">{item.label}</span>
                                    <span className="text-sm font-semibold text-slate-300">{item.value.toLocaleString()}</span>
                                </div>
                                <div className="h-1.5 w-full rounded-full bg-slate-800">
                                    <div
                                        className={`h-1.5 rounded-full ${item.color}`}
                                        style={{ width: `${Math.min(100, (item.value / item.total) * 100)}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Users */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-base font-semibold text-slate-200 mb-4">Recent Signups</h2>
                    <div className="space-y-3">
                        {(stats?.recentUsers ?? []).map((user: any) => (
                            <div key={user.id} className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-brand/10 border border-brand/20 overflow-hidden flex items-center justify-center text-brand font-bold text-sm shrink-0">
                                    {user.profileImage ? (
                                        <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        user.username?.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-200 truncate">{user.username}</p>
                                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                </div>
                                {user.isAdmin && (
                                    <span className="text-[10px] font-bold bg-brand/10 text-brand px-2 py-0.5 rounded-full border border-brand/20">ADMIN</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
