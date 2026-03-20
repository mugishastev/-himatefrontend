import React, { useState, useEffect } from 'react';
import { useUIStore } from '../../../store/ui.store';
import { useAuthStore } from '../../../store/auth.store';
import { useCallStore } from '../../../store/call.store';
import { usersApi } from '../../../api/users.api';
import { UserAvatar } from '../../users/components/UserAvatar';
import { callsApi } from '../../../api/calls.api';
import { socketEmitters } from '../../../socket/socket.emitters';

export const StartCallModal: React.FC = () => {
    const { closeModal } = useUIStore();
    const { user } = useAuthStore();
    const { startCall } = useCallStore();

    const [users, setUsers] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // GET /users already excludes ADMIN role server-side
                const response = await usersApi.findAll({ limit: 200 });
                const raw: any[] = response.data ?? response ?? [];
                // Also exclude ourselves
                setUsers(raw.filter((u: any) => u.id !== user?.id));
            } catch (err) {
                console.error('Failed to load users for calling', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, [user?.id]);

    const handlePlaceCall = async (targetUser: any, type: 'AUDIO' | 'VIDEO') => {
        try {
            await callsApi.createCall({
                callerId: Number(user?.id),
                receiverId: Number(targetUser.id),
                startedAt: new Date().toISOString(),
                type,
            });
            socketEmitters.initiateCall(targetUser.id, type, 0);
            startCall({ user: targetUser, userId: targetUser.id }, type);
            closeModal();
        } catch (err) {
            console.error('Call initialization failed', err);
            alert('Could not start the call. Please try again.');
        }
    };

    const filteredUsers = users.filter((u: any) => {
        if (!search.trim()) return true;
        return u.username?.toLowerCase().includes(search.toLowerCase());
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#111b21] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[540px] border border-[#2a3942]">

                {/* Header */}
                <div className="bg-[#202c33] px-4 py-3 flex items-center gap-3">
                    <button onClick={closeModal} className="p-2 -ml-1 hover:bg-white/10 rounded-full transition-colors text-[#aebac1]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <h2 className="text-[#d1d7db] text-[19px] font-medium flex-1">Start a Call</h2>
                    <span className="text-[#8696a0] text-sm">{filteredUsers.length} users</span>
                </div>

                {/* Search */}
                <div className="px-4 py-2 bg-[#111b21] border-b border-[#2a3942]">
                    <div className="flex items-center gap-2 bg-[#202c33] rounded-lg px-3 py-2">
                        <svg className="w-4 h-4 text-[#8696a0] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
                        </svg>
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search name or username..."
                            className="flex-1 bg-transparent outline-none text-[#d1d7db] text-[15px] placeholder-[#8696a0]"
                            autoFocus
                        />
                        {search && (
                            <button onClick={() => setSearch('')} className="text-[#8696a0] hover:text-white transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* User List */}
                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full gap-3 text-[#aebac1]">
                            <div className="w-8 h-8 border-[3px] border-t-transparent border-[#00a884] rounded-full animate-spin" />
                            <span className="text-sm">Loading users…</span>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full gap-3 p-6 text-center">
                            <div className="w-16 h-16 rounded-full bg-[#202c33] flex items-center justify-center">
                                <svg className="w-8 h-8 text-[#8696a0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m0-9a4 4 0 110 8 4 4 0 010-8z" />
                                </svg>
                            </div>
                            <p className="text-[#d1d7db] font-medium">No users found</p>
                            <p className="text-[#8696a0] text-sm">Try a different search term.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col py-1">
                            {filteredUsers.map((u: any) => (
                                <div key={u.id} className="flex items-center px-4 py-3 hover:bg-[#202c33] group transition-colors">
                                    <UserAvatar user={u} size="md" />
                                    <div className="ml-4 flex-1 min-w-0">
                                        <h3 className="text-[#d1d7db] text-[16px] font-medium truncate">{u.username}</h3>
                                        <p className="text-[#8696a0] text-[13px] truncate">{u.bio || 'Himate user'}</p>
                                    </div>
                                    {/* Call buttons — visible on hover */}
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-150">
                                        <button
                                            onClick={() => handlePlaceCall(u, 'AUDIO')}
                                            className="w-10 h-10 rounded-full hover:bg-[#00a884]/20 flex items-center justify-center text-[#00a884] transition-colors"
                                            title="Voice call"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handlePlaceCall(u, 'VIDEO')}
                                            className="w-10 h-10 rounded-full hover:bg-[#00a884]/20 flex items-center justify-center text-[#00a884] transition-colors"
                                            title="Video call"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
