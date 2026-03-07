import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/auth.store';

type NavItem = { label: string; path: string; end?: boolean; icon: React.ReactNode };
type NavGroup = { heading: string; items: NavItem[] };

const navGroups: NavGroup[] = [
    {
        heading: 'Management',
        items: [
            {
                label: 'Overview', path: '/admin', end: true,
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
            },
            {
                label: 'Users', path: '/admin/users',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
            },
            {
                label: 'Conversations', path: '/admin/conversations',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
            },
            {
                label: 'Messages', path: '/admin/messages',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
            },
        ],
    },
    {
        heading: 'Safety & Support',
        items: [
            {
                label: 'Reports', path: '/admin/reports',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
            },
            {
                label: 'Banned Users', path: '/admin/banned',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>,
            },
            {
                label: 'Support Tickets', path: '/admin/tickets',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>,
            },
        ],
    },
    {
        heading: 'Marketing & Tools',
        items: [
            {
                label: 'Announcements', path: '/admin/announcements',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>,
            },
            {
                label: 'Media Gallery', path: '/admin/media',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
            },
        ],
    },
    {
        heading: 'System',
        items: [
            {
                label: 'Settings', path: '/admin/settings',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
            },
            {
                label: 'Admin Roles', path: '/admin/roles',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
            },
        ],
    },
];

export const AdminLayout: React.FC = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0 overflow-y-auto`}>
                {/* Logo */}
                <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden bg-white/5 p-1 border border-white/10">
                        <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    {isSidebarOpen && (
                        <div>
                            <div className="font-bold text-white text-sm">Himate</div>
                            <div className="text-[10px] text-brand font-semibold uppercase tracking-widest">Admin Panel</div>
                        </div>
                    )}
                </div>

                {/* Grouped Nav */}
                <nav className="flex-1 py-4 px-3 space-y-6">
                    {navGroups.map((group) => (
                        <div key={group.heading}>
                            {isSidebarOpen && (
                                <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">{group.heading}</p>
                            )}
                            <div className="space-y-0.5">
                                {group.items.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        end={item.end}
                                        title={!isSidebarOpen ? item.label : undefined}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${isActive
                                                ? 'bg-brand/15 text-brand'
                                                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                                            }`
                                        }
                                    >
                                        <span className="flex-shrink-0">{item.icon}</span>
                                        {isSidebarOpen && <span>{item.label}</span>}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* User footer */}
                <div className="p-4 border-t border-slate-800 sticky bottom-0 bg-slate-900">
                    {isSidebarOpen ? (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center text-brand text-xs font-bold overflow-hidden flex-shrink-0">
                                {user?.profileImage ? (
                                    <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    user?.username?.charAt(0).toUpperCase()
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-200 truncate">{user?.username}</p>
                                <p className="text-xs text-brand font-medium">Administrator</p>
                            </div>
                            <button onClick={handleLogout} className="p-1.5 rounded-md hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors" title="Logout">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            </button>
                        </div>
                    ) : (
                        <button onClick={handleLogout} className="w-full flex justify-center p-1.5 rounded-md hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors" title="Logout">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        </button>
                    )}
                </div>
            </aside>

            {/* Collapse Button */}
            <button
                onClick={() => setIsSidebarOpen((v) => !v)}
                className="absolute left-[calc(var(--sidebar-w)-12px)] top-6 z-50 w-6 h-6 rounded-full bg-brand/20 border border-brand/30 text-brand flex items-center justify-center hover:bg-brand/30 transition-colors"
                style={{ '--sidebar-w': isSidebarOpen ? '256px' : '80px' } as React.CSSProperties}
            >
                <svg className={`w-3 h-3 transition-transform ${isSidebarOpen ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </button>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};
