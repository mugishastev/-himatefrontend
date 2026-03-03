import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { UserAvatar } from '../../features/users/components/UserAvatar';

export const Sidebar: React.FC = () => {
    const location = useLocation();
    const { user } = useAuthStore();

    const navItems = [
        { label: 'Messages', path: '/dashboard', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
        { label: 'Contacts', path: '/contacts', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
        { label: 'Notifications', path: '/notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    ];

    return (
        <div className="w-24 lg:w-64 h-full bg-white border-r border-gray-100 flex flex-col py-8 shadow-sm">
            <div className="px-6 mb-12 flex items-center">
                <div className="w-12 h-12 flex items-center justify-center">
                    <img src="/logo.png" alt="Himate" className="w-full h-auto object-contain" />
                </div>
                <h1 className="hidden lg:block ml-4 text-2xl font-black text-brand tracking-tighter">
                    Himate
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`
                            flex items-center p-4 rounded-2xl transition-all group
                            ${location.pathname === item.path
                                ? 'bg-brand text-white shadow-brand/20 shadow-lg'
                                : 'text-text-secondary hover:bg-bg-secondary hover:text-brand'}
                        `}
                    >
                        <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                        </svg>
                        <span className="hidden lg:block ml-4 font-bold tracking-wide">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="px-4 mt-auto">
                <div className="p-4 bg-bg-secondary rounded-2xl flex items-center lg:space-x-3">
                    {user && <UserAvatar user={user} size="sm" />}
                    <div className="hidden lg:block min-w-0">
                        <p className="text-sm font-bold text-text-primary truncate">{user?.username}</p>
                        <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Premium</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
