import React, { useState } from 'react';
import { useUIStore } from '../../../store/ui.store';
import { usersApi } from '../../../api/users.api';
import { useCallStore } from '../../../store/call.store';
import { callsApi } from '../../../api/calls.api';
import { useAuthStore } from '../../../store/auth.store';
import { socketEmitters } from '../../../socket/socket.emitters';

export const DialpadModal: React.FC = () => {
    const [number, setNumber] = useState('');
    const { closeModal } = useUIStore();
    const { startCall } = useCallStore();
    const { user: currentUser } = useAuthStore();
    
    const handleDigit = (digit: string) => {
        setNumber(prev => prev.length < 15 ? prev + digit : prev);
    };

    const handleBackspace = () => {
        setNumber(prev => prev.slice(0, -1));
    };

    const handleCall = async () => {
        if (!number) return;
        
        try {
            // Find a user by this phone number or username
            // In a real app we'd strictly search by phone number from the API
            const response = await usersApi.findAll({ search: number });
            const foundUsers = response.data || [];
            
            if (foundUsers.length === 0) {
                alert(`The number ${number} is not registered on Himate.`);
                return;
            }

            const targetUser = foundUsers[0];

            await callsApi.createCall({
                callerId: Number(currentUser?.id),
                receiverId: Number(targetUser.id),
                startedAt: new Date().toISOString(),
                type: 'AUDIO'
            });
            
            socketEmitters.initiateCall(targetUser.id, 'AUDIO', 0);
            startCall({ user: targetUser, userId: targetUser.id }, 'AUDIO');
            closeModal();
        } catch (err) {
            console.error('Dialpad call failed', err);
            alert(`Failed to route call for ${number}`);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
            <div className="bg-[#111b21] w-full max-w-[320px] rounded-[32px] shadow-2xl overflow-hidden flex flex-col border border-[#222e35] pb-8 pt-4 relative">
                <button onClick={closeModal} className="absolute right-4 top-4 p-2 text-[#aebac1] hover:text-white rounded-full transition-colors z-10">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="h-24 flex items-center justify-center px-6 relative w-full overflow-hidden mt-6 mb-4">
                    <h2 className="text-4xl text-white font-medium tracking-wider text-center truncate">{number || '\u00A0'}</h2>
                    {number.length > 0 && (
                        <button onClick={handleBackspace} className="absolute right-6 top-1/2 -translate-y-1/2 p-2 text-[#aebac1] hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" /></svg>
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-3 gap-y-4 gap-x-6 px-10 pb-6 w-full place-items-center">
                    {[
                        { num: '1', sub: 'oo' }, { num: '2', sub: 'ABC' }, { num: '3', sub: 'DEF' },
                        { num: '4', sub: 'GHI' }, { num: '5', sub: 'JKL' }, { num: '6', sub: 'MNO' },
                        { num: '7', sub: 'PQRS' }, { num: '8', sub: 'TUV' }, { num: '9', sub: 'WXYZ' },
                        { num: '*', sub: '' }, { num: '0', sub: '+' }, { num: '#', sub: '' },
                    ].map((btn) => (
                        <button 
                            key={btn.num} 
                            onClick={() => handleDigit(btn.num)}
                            className="w-[72px] h-[72px] rounded-full bg-[#1F2937]/50 hover:bg-[#2a3942] flex flex-col items-center justify-center transition-colors active:bg-[#374b57]"
                        >
                            <span className="text-[28px] font-normal leading-tight text-[#d1d7db]">{btn.num}</span>
                            {btn.sub && <span className="text-[10px] text-[#8696a0] font-bold tracking-widest uppercase">{btn.sub}</span>}
                        </button>
                    ))}
                </div>

                <div className="flex justify-center w-full px-6">
                    <button 
                        onClick={handleCall}
                        disabled={!number}
                        className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 ${number ? 'bg-[#00a884] hover:bg-[#00c99e] text-white shadow-[#00a884]/20' : 'bg-[#1F2937] text-[#aebac1] opacity-50 cursor-not-allowed'}`}
                    >
                        <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};
