import React, { useState, useEffect } from 'react';
import { useUIStore } from '../../../store/ui.store';
import { useAuthStore } from '../../../store/auth.store';
import { usersApi } from '../../../api/users.api';
import { UserAvatar } from '../../users/components/UserAvatar';
import { callsApi } from '../../../api/calls.api';

export const ScheduleCallModal: React.FC = () => {
    const { closeModal } = useUIStore();
    const { user } = useAuthStore();
    
    const [contacts, setContacts] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [scheduledDate, setScheduledDate] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // GET /users already excludes ADMIN role server-side
                const response = await usersApi.findAll({ limit: 200 });
                const raw: any[] = response.data ?? response ?? [];
                setContacts(raw.filter((u: any) => u.id !== user?.id));
            } catch (err) {
                console.error('Failed to load users', err);
            }
        };
        fetchUsers();

        // Auto-set tomorrow's date at noon
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setScheduledDate(tomorrow.toISOString().split('T')[0]);
        setScheduledTime('12:00');
    }, [user?.id]);

    const handleSchedule = async () => {
        if (!selectedUser || !scheduledDate || !scheduledTime) return;
        
        setIsLoading(true);
        const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
        
        try {
            await callsApi.scheduleCall({
                callerId: Number(user?.id),
                receiverId: Number(selectedUser.id),
                scheduledAt,
                type: 'VIDEO' // Default to video for scheduled calls
            });
            
            alert(`Call accurately scheduled with ${selectedUser.username}!`);
            closeModal();
        } catch (err) {
            console.error('Failed to schedule call', err);
            alert('Scheduling failed due to server error.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
            <div className="bg-[#111b21] w-full max-w-[400px] rounded-[24px] shadow-2xl overflow-hidden flex flex-col border border-[#222e35]">
                {/* Header */}
                <div className="bg-[#202c33] px-6 py-4 flex items-center relative">
                    <h2 className="text-[20px] font-medium text-[#d1d7db] mx-auto">Schedule a Call</h2>
                    <button onClick={closeModal} className="absolute right-4 p-2 text-[#aebac1] hover:text-white rounded-full transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 flex flex-col space-y-6">
                    {/* User Selection */}
                    <div>
                        <label className="block text-[#00a884] text-[13px] font-semibold uppercase tracking-wide mb-3">Participant</label>
                        {!selectedUser ? (
                            <div className="max-h-48 overflow-y-auto no-scrollbar space-y-1 bg-[#1F2937]/50 rounded-xl p-2 border border-[#2a3942]">
                                {contacts.map(u => {
                                    if (!u) return null;
                                    return (
                                        <div
                                            key={u.id}
                                            onClick={() => setSelectedUser(u)}
                                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#2a3942] cursor-pointer transition-colors"
                                        >
                                            <UserAvatar user={u} size="sm" />
                                            <span className="text-[#d1d7db] font-medium">{u.username}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex items-center justify-between p-3 bg-[#1F2937] rounded-xl border border-[#2a3942]">
                                <div className="flex items-center gap-3">
                                    <UserAvatar user={selectedUser} size="md" />
                                    <span className="text-white font-medium text-[16px]">{selectedUser.username}</span>
                                </div>
                                <button onClick={() => setSelectedUser(null)} className="text-[#00a884] hover:text-[#00c99e] text-sm font-semibold">Change</button>
                            </div>
                        )}
                    </div>

                    {/* Date/Time Pickers */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[#aebac1] text-[13px] mb-2 font-medium">Date</label>
                            <input 
                                type="date" 
                                value={scheduledDate}
                                onChange={(e) => setScheduledDate(e.target.value)}
                                className="w-full bg-[#1F2937] border border-[#2a3942] text-white rounded-lg p-2.5 outline-none focus:border-[#00a884] transition-colors" 
                            />
                        </div>
                        <div>
                            <label className="block text-[#aebac1] text-[13px] mb-2 font-medium">Time</label>
                            <input 
                                type="time" 
                                value={scheduledTime}
                                onChange={(e) => setScheduledTime(e.target.value)}
                                className="w-full bg-[#1F2937] border border-[#2a3942] text-white rounded-lg p-2.5 outline-none focus:border-[#00a884] transition-colors" 
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-[#202c33] border-t border-[#2a3942] flex justify-end gap-3 mt-auto">
                    <button 
                        onClick={closeModal}
                        className="px-6 py-2.5 rounded-full text-[#00a884] font-medium hover:bg-white/5 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSchedule}
                        disabled={!selectedUser || isLoading}
                        className={`px-8 py-2.5 rounded-full font-medium shadow-lg transition-colors flex items-center justify-center
                            ${selectedUser && !isLoading ? 'bg-[#00a884] text-[#111b21] hover:bg-[#00c99e]' : 'bg-[#1F2937] text-[#aebac1] cursor-not-allowed opacity-70'}`}
                    >
                        {isLoading ? (
                           <div className="w-5 h-5 border-2 border-t-transparent border-[#111b21] rounded-full animate-spin"></div>
                        ) : 'Save Schedule'}
                    </button>
                </div>
            </div>
        </div>
    );
};
