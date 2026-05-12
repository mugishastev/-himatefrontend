import React from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquare, Users, Settings } from 'lucide-react';

export const MobileNav: React.FC = () => {
    const navItems = [
        { label: 'Chat', path: '/dashboard', icon: MessageSquare },
        { label: 'Contacts', path: '/contacts', icon: Users },
        { label: 'Settings', path: '/settings', icon: Settings },
    ];

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#111827] border-t border-[#1F2937] flex justify-around items-center h-16 px-4 z-40 pb-safe">
            {navItems.map((item) => {
                const Icon = item.icon;
                return (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex flex-col items-center justify-center space-y-1 transition-all duration-200 flex-1
                            ${isActive ? 'text-brand' : 'text-[#aebac1] hover:text-[#d1d7db]'}
                        `}
                    >
                        <Icon className="w-6 h-6" strokeWidth={2} />
                        <span className="text-[10px] font-bold tracking-wider uppercase">{item.label}</span>
                    </NavLink>
                );
            })}
        </nav>
    );
};
