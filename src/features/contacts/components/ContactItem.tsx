import React from 'react';
import type { User } from '../../../types/user.types';
import { UserAvatar } from '../../users/components/UserAvatar';

interface ContactItemProps {
    contact: User;
    onOpenProfile?: (user: User) => void;
}

export const ContactItem: React.FC<ContactItemProps> = ({ contact, onOpenProfile }) => {
    return (
        <div
            className="bg-[#202c33] rounded-2xl p-5 hover:shadow-md border border-transparent hover:border-[#F97316]/20 transition-all duration-300 flex flex-col items-center text-center group relative overflow-hidden cursor-pointer"
            onClick={() => onOpenProfile?.(contact)}
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-[#F97316]/0 group-hover:bg-[#F97316] transition-colors duration-300"></div>

            <div className="w-20 h-20 rounded-full overflow-hidden shadow-sm mb-4 ring-2 ring-transparent group-hover:ring-[#F97316]/10 transition-all">
                <UserAvatar user={contact} size="full" className="w-full h-full object-cover" />
            </div>

            <h4 className="text-lg font-bold text-[#e9edef] group-hover:text-[#F97316] transition-colors truncate w-full px-2">
                {contact.username}
            </h4>

            <div className="flex items-center gap-1.5 mt-3 px-3 py-1 bg-[#111b21] rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00a884] block"></span>
                <p className="text-[11px] font-semibold text-[#8696a0] uppercase tracking-wider">
                    {contact.status || 'Active'}
                </p>
            </div>

            {/* View Profile Button Hover State */}
            <div className="absolute inset-0 bg-[#202c33]/0 group-hover:bg-[#202c33]/90 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer">
                <button className="flex items-center gap-2 bg-[#F97316] text-[#111b21] px-5 py-2.5 rounded-full font-bold shadow-md hover:scale-105 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    <span>View Info</span>
                </button>
            </div>
        </div>
    );
};
