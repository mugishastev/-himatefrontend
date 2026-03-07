import React from 'react';
import type { StatusPost } from '../../../types/status.types';
import { useAuthStore } from '../../../store/auth.store';

interface StatusCirclesProps {
    statuses: StatusPost[];
    onStatusClick: (status: StatusPost) => void;
    onAddStatusClick: () => void;
}

export const StatusCircles: React.FC<StatusCirclesProps> = ({
    statuses,
    onStatusClick,
    onAddStatusClick
}) => {
    const { user } = useAuthStore();

    const grouped = statuses.reduce((acc, s) => {
        const key = String(s.userId);
        if (!acc[key]) acc[key] = [];
        acc[key].push(s);
        return acc;
    }, {} as Record<string, StatusPost[]>);

    const myStatuses = grouped[String(user?.id || 0)] || [];
    const otherIds = Object.keys(grouped).filter(id => id !== String(user?.id));

    return (
        <div className="flex items-center gap-5 overflow-x-auto pb-4 no-scrollbar px-2">
            {/* My Status */}
            <div
                className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
                onClick={() => myStatuses.length > 0 ? onStatusClick(myStatuses[0]) : onAddStatusClick()}
            >
                <div className={`relative w-16 h-16 rounded-full p-[2.5px] ${myStatuses.length > 0 ? 'bg-brand' : 'bg-[#dfe5e7]'} group-hover:scale-105 transition-transform duration-200`}>
                    <div className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center text-brand font-bold text-lg">
                        {user?.avatarUrl
                            ? <img src={user.avatarUrl} alt="Me" className="w-full h-full object-cover" />
                            : (user?.username || 'M').charAt(0).toUpperCase()
                        }
                    </div>
                    {myStatuses.length === 0 && (
                        <div className="absolute bottom-0 right-0 w-5 h-5 bg-brand rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">+</div>
                    )}
                </div>
                <span className="text-[11px] text-[#667781] font-medium">My Status</span>
            </div>

            {/* Friends */}
            {otherIds.map(uid => {
                const list = grouped[uid];
                const first = list[0];
                const name = first.user?.username || `User ${uid}`;
                return (
                    <div
                        key={uid}
                        className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
                        onClick={() => onStatusClick(first)}
                    >
                        <div className="relative w-16 h-16 rounded-full p-[2.5px] bg-brand group-hover:scale-105 transition-transform duration-200">
                            <div className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center text-[#667781] font-bold text-lg">
                                {first.user?.avatarUrl
                                    ? <img src={first.user.avatarUrl} alt={name} className="w-full h-full object-cover" />
                                    : name.charAt(0).toUpperCase()
                                }
                            </div>
                            {list.length > 1 && (
                                <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-brand rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
                                    {list.length}
                                </span>
                            )}
                        </div>
                        <span className="text-[11px] text-[#111b21] truncate w-16 text-center">{name}</span>
                    </div>
                );
            })}
        </div>
    );
};
