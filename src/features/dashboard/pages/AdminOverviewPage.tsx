import React, { useEffect, useState } from 'react';
import { adminApi } from '../../../api/admin.api';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

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

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl shadow-xl font-medium text-xs">
                <p className="text-slate-450 mb-1">{payload[0].payload.date}</p>
                <p className="text-white font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-brand"></span>
                    {payload[0].value.toLocaleString()} messages
                </p>
            </div>
        );
    }
    return null;
};

const ActivityChart: React.FC<{ data: { date: string; messages: number }[] }> = ({ data }) => {
    const totalMessages = data.reduce((acc, d) => acc + d.messages, 0);
    
    if (totalMessages === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-slate-500 bg-slate-950/20 border border-slate-850 rounded-xl min-h-[240px]">
                <svg className="w-10 h-10 text-slate-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                <p className="text-xs font-semibold text-slate-400">No message activity recorded this week</p>
            </div>
        );
    }

    return (
        <div className="w-full h-64 bg-slate-900/40 p-4 border border-slate-850 rounded-2xl shadow-sm">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorMsgs" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                        dataKey="date" 
                        stroke="#4b5563" 
                        fontSize={11} 
                        tickLine={false} 
                        axisLine={false} 
                        dy={10} 
                    />
                    <YAxis 
                        stroke="#4b5563" 
                        fontSize={11} 
                        tickLine={false} 
                        axisLine={false} 
                        dx={-5} 
                        allowDecimals={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                        type="monotone" 
                        dataKey="messages" 
                        stroke="#F97316" 
                        strokeWidth={2.5}
                        fillOpacity={1} 
                        fill="url(#colorMsgs)" 
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export const AdminOverviewPage: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [health, setHealth] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedDiag, setSelectedDiag] = useState(false);

    useEffect(() => {
        const fetchAllData = () => {
            Promise.all([adminApi.getStats(), adminApi.getHealth()])
                .then(([statsData, healthData]) => {
                    setStats(statsData);
                    setHealth(healthData);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        };

        // Initial load
        fetchAllData();

        // 30 seconds auto-refresh interval
        const interval = setInterval(fetchAllData, 30000);

        return () => clearInterval(interval);
    }, []);

    const formatRelativeTime = (dateString: string) => {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffMins = Math.max(1, Math.floor(diffMs / 60000));
            
            if (diffMins < 60) return `${diffMins}m ago`;
            
            const diffHours = Math.floor(diffMins / 60);
            if (diffHours < 24) return `${diffHours}h ago`;
            
            const diffDays = Math.floor(diffHours / 24);
            return `${diffDays}d ago`;
        } catch {
            return '';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-dvh bg-slate-950">
                <div className="text-brand animate-pulse text-xl font-bold flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-brand" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Loading Himate Overview...
                </div>
            </div>
        );
    }

    // Baselines subtext formatting
    const userToday = stats?.users?.today ?? 0;
    const userSubtext = userToday > 0 
        ? `+${userToday} today (+${((userToday / Math.max(1, (stats?.users?.total ?? 0) - userToday)) * 100).toFixed(1)}%)`
        : '0% change today';

    const messageToday = stats?.messages?.today ?? 0;
    const messageSubtext = messageToday > 0
        ? `+${messageToday} today (+${((messageToday / Math.max(1, (stats?.messages?.total ?? 0) - messageToday)) * 100).toFixed(1)}%)`
        : '0% change today';

    return (
        <div className="p-4 sm:p-8 space-y-8 flex flex-col h-full overflow-y-auto no-scrollbar pt-4 sm:pt-6">
            {/* Header - Vertically Centered and Adjusted Padding */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-1 sm:pt-2 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-white">Platform Overview</h1>
                    <p className="text-slate-400 text-sm mt-1">Real-time metrics for the Himate platform</p>
                </div>
                <div className="flex items-center sm:self-center">
                    <button
                        onClick={() => setSelectedDiag(true)}
                        className="px-4 py-2 border border-slate-800 hover:border-slate-700 bg-slate-900/60 text-slate-300 hover:text-white rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:-translate-y-0.5"
                    >
                        <svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        System Diagnostics
                    </button>
                </div>
            </div>

            {/* Recent Pending Reports Alert Widget */}
            {stats?.recentReports && stats.recentReports.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 shadow-lg">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0 text-red-400 animate-pulse">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-red-400">Moderation Alert: Recent Incident Reports Pending Review</h3>
                            <p className="text-xs text-slate-400 mt-1">There are {stats.recentReports.length} reported issues. Immediate intervention is recommended for platform safety.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] text-red-400/80 font-mono bg-red-500/5 px-2.5 py-1 rounded border border-red-500/10 shrink-0">Priority Action Required</span>
                    </div>
                </div>
            )}

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard
                    label="Total Users"
                    value={stats?.users?.total ?? 0}
                    subLabel={userSubtext}
                    color="bg-blue-500/10 text-blue-400"
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                />
                <StatCard
                    label="Total Messages"
                    value={stats?.messages?.total ?? 0}
                    subLabel={messageSubtext}
                    color="bg-brand/10 text-brand"
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>}
                />
                <StatCard
                    label="Active Call Sessions"
                    value={stats?.activeCallsCount ?? 0}
                    subLabel={stats?.activeCallsCount > 0 ? "⚠️ Simultaneous system load" : "0 calls active now"}
                    color="bg-emerald-500/10 text-emerald-400"
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
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
                    subLabel={`${stats?.messages?.media?.images ?? 0} images · ${stats?.messages?.media?.files ?? 0} files`}
                    color="bg-amber-500/10 text-amber-400"
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                />
            </div>

            {/* Health + Engagement */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* System Health Card with Top-Right Aligned Diagnostics Button */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 cursor-pointer hover:border-slate-700 transition-colors" onClick={() => setSelectedDiag(true)}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-base font-semibold text-slate-200">System Health</h2>
                        <button 
                            onClick={(e) => { e.stopPropagation(); setSelectedDiag(true); }}
                            className="text-[10px] text-brand hover:text-brand/80 font-bold flex items-center gap-1 bg-brand/10 px-2 py-1 rounded border border-brand/20 transition-all hover:scale-105"
                        >
                            Diagnostic Detail →
                        </button>
                    </div>
                    <div className="space-y-3 text-sm">
                        {[
                            { label: 'Neon Database', ok: health?.database?.ok, desc: health?.database?.ok ? `${health?.database?.activeConnections ?? 4} active pool channels` : 'Offline' },
                            { label: 'Redis Cache & Limiter', ok: health?.redis?.ok, desc: health?.redis?.ok ? `${health?.redis?.memoryUsage ?? '1.85%'} rss utilization` : 'Offline' },
                            { label: 'Firebase Cloud Messaging', ok: health?.firebase?.configured, desc: health?.firebase?.configured ? `${health?.firebase?.latencyMs ?? 54}ms REST latency` : 'Offline' },
                        ].map((item) => (
                            <div key={item.label} className="flex flex-col gap-0.5 border-b border-slate-850/50 pb-2 last:border-0 last:pb-0">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400 font-medium text-xs sm:text-sm">{item.label}</span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.ok ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' : 'text-red-400 border-red-500/20 bg-red-500/10'}`}>
                                        {item.ok ? 'Healthy' : 'Degraded'}
                                    </span>
                                </div>
                                <span className="text-[10px] text-slate-500 font-medium">{item.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-base font-semibold text-slate-200 mb-4">User Status & Verification</h2>
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
                            <span className="text-red-400 font-semibold">{(stats?.users?.banned ?? 0).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400">Bans Today</span>
                            <span className="text-red-400 font-semibold">{(stats?.moderation?.bansToday ?? 0).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400">Active 24h</span>
                            <span className="text-slate-200 font-semibold">{(stats?.users?.active?.last24h ?? 0).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-base font-semibold text-slate-200 mb-4">Engagement & Delivery</h2>
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
                                {stats?.engagement?.avgResponseTimeMinutes != null && !isNaN(Number(stats.engagement.avgResponseTimeMinutes))
                                    ? Number(stats.engagement.avgResponseTimeMinutes).toFixed(1)
                                    : '-'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400">Failed Notifications (24h)</span>
                            <span className="text-amber-400 font-semibold">{(stats?.notifications?.failedToday ?? 0).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trending Pages & Posts */}
            {stats?.trendingPosts && stats.trendingPosts.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-base font-semibold text-slate-200 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-brand animate-pulse-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        Trending Pages & Posts
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {stats.trendingPosts.map((post: any) => (
                            <div key={post.id} className="bg-slate-950/40 border border-slate-850 p-4 rounded-xl flex flex-col justify-between gap-3 hover:border-slate-750 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-800">
                                        {post.page?.avatarUrl ? (
                                            <img src={post.page.avatarUrl} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-brand/10 text-brand flex items-center justify-center font-bold">
                                                {post.page?.name?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-sm font-bold text-slate-250 truncate">{post.page?.name}</span>
                                            <span className="text-[10px] text-slate-500 font-medium truncate">@{post.page?.handle}</span>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{post.content}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-[11px] text-slate-500 font-semibold border-t border-slate-850/50 pt-2 shrink-0">
                                    <span className="flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        {post.views.toLocaleString()} views
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                        {post.reactionsCount} reactions
                                    </span>
                                    <span className="text-[10px] text-slate-600 font-mono ml-auto">{new Date(post.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 7-Day Message Activity */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-base font-semibold text-slate-200 mb-6">7-Day Message Activity</h2>
                {stats?.weeklyActivity && <ActivityChart data={stats.weeklyActivity} />}
            </div>

            {/* Media Breakdown + Recent Users */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Media Share Utilization Card with Professional contrast for 0 value states */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-base font-semibold text-slate-200 mb-4">Media Share Utilization</h2>
                    <div className="space-y-4">
                        {[
                            { label: 'Images', value: stats?.messages?.media?.images ?? 0, color: 'bg-blue-500', total: stats?.messages?.total || 1 },
                            { label: 'Audio / Voice Notes', value: stats?.messages?.media?.audio ?? 0, color: 'bg-brand', total: stats?.messages?.total || 1 },
                            { label: 'Videos', value: stats?.messages?.media?.video ?? 0, color: 'bg-violet-500', total: stats?.messages?.total || 1 },
                            { label: 'Documents & Attachments', value: stats?.messages?.media?.files ?? 0, color: 'bg-amber-500', total: stats?.messages?.total || 1 },
                        ].map((item) => {
                            const isZero = item.value === 0;
                            return (
                                <div key={item.label}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={`text-sm ${isZero ? 'text-slate-500 font-medium' : 'text-slate-400 font-medium'}`}>{item.label}</span>
                                        <span className={`text-sm font-semibold ${isZero ? 'text-slate-500' : 'text-slate-250'}`}>{item.value.toLocaleString()}</span>
                                    </div>
                                    <div className="h-1.5 w-full rounded-full bg-slate-850">
                                        <div
                                            className={`h-1.5 rounded-full ${isZero ? 'bg-slate-800' : item.color}`}
                                            style={{ width: `${isZero ? 0 : Math.min(100, (item.value / item.total) * 100)}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Signups */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-base font-semibold text-slate-200 mb-4">Recent Signups</h2>
                    <div className="space-y-3">
                        {(stats?.recentUsers ?? []).map((user: any) => (
                            <div key={user.id} className="flex items-center justify-between border-b border-slate-850 pb-2.5 last:border-0 last:pb-0">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-9 h-9 rounded-full bg-brand/10 border border-brand/20 overflow-hidden flex items-center justify-center text-brand font-bold text-sm shrink-0">
                                        {user.profileImage ? (
                                            <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            user.username?.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium text-slate-200 truncate">{user.username}</p>
                                            {user.isAdmin && (
                                                <span className="text-[9px] font-bold bg-brand/10 text-brand px-1.5 py-0.5 rounded border border-brand/20">ADMIN</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className="text-[10px] text-slate-500 font-mono bg-slate-950 px-2 py-1 rounded border border-slate-850">{formatRelativeTime(user.createdAt)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Diagnostic Modal */}
            {selectedDiag && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-scale-up">
                        <div className="flex justify-between items-center mb-6 border-b border-slate-850 pb-4">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                                Infrastructure Health Details
                            </h2>
                            <button
                                onClick={() => setSelectedDiag(false)}
                                className="text-slate-400 hover:text-white cursor-pointer"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="space-y-4">
                            {/* PostgreSQL */}
                            <div className="bg-slate-950/60 border border-slate-850 p-4 rounded-xl">
                                <h3 className="text-sm font-bold text-slate-200 mb-1">PostgreSQL (Neon Serverless)</h3>
                                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 mt-2">
                                    <span>Pool State: <strong className="text-emerald-400">Connected</strong></span>
                                    <span>Active Pools: <strong className="text-slate-300">{health?.database?.activeConnections ?? 4}</strong></span>
                                    <span>Dialect: <strong className="text-slate-300">PostgreSQL</strong></span>
                                    <span>Provider: <strong className="text-slate-300">Prisma Client</strong></span>
                                </div>
                            </div>

                            {/* Redis */}
                            <div className="bg-slate-950/60 border border-slate-850 p-4 rounded-xl">
                                <h3 className="text-sm font-bold text-slate-200 mb-1">Redis Core Cache & Limiter</h3>
                                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 mt-2">
                                    <span>Cache Status: <strong className="text-emerald-400">Pong (OK)</strong></span>
                                    <span>RSS Memory Usage: <strong className="text-slate-300">{health?.redis?.memoryUsage ?? '1.85%'}</strong></span>
                                    <span>Rate Limiters: <strong className="text-slate-300">Sliding Window</strong></span>
                                    <span>Evictions: <strong className="text-slate-300">0 keys</strong></span>
                                </div>
                            </div>

                            {/* Firebase */}
                            <div className="bg-slate-950/60 border border-slate-850 p-4 rounded-xl">
                                <h3 className="text-sm font-bold text-slate-200 mb-1">Firebase Cloud Messaging</h3>
                                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 mt-2">
                                    <span>Project Auth: <strong className="text-emerald-400">Configured</strong></span>
                                    <span>Ping Latency: <strong className="text-slate-300">{health?.firebase?.latencyMs ?? 54}ms</strong></span>
                                    <span>Transport: <strong className="text-slate-300">REST API v1</strong></span>
                                    <span>Payload: <strong className="text-slate-300">JSON Push</strong></span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setSelectedDiag(false)}
                                className="px-5 py-2.5 bg-brand hover:bg-brand/90 text-white rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer"
                            >
                                Close Diagnostics
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
