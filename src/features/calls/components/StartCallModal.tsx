import React, { useState, useEffect } from 'react';
import { useUIStore } from '../../../store/ui.store';
import { useAuthStore } from '../../../store/auth.store';
import { useCallStore } from '../../../store/call.store';
import api from '../../../api/axios'; // or contactsApi if available
import { UserAvatar } from '../../users/components/UserAvatar';
import { callsApi } from '../../../api/calls.api';
import { socketEmitters } from '../../../socket/socket.emitters';

export const StartCallModal: React.FC = () => {
    const { closeModal } = useUIStore();
    const { user } = useAuthStore();
    const { startCall } = useCallStore();
    
    const [contacts, setContacts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                // Adjusting to raw axios since we don't know the exact contactsApi structure
                // Assuming it's typically GET /contacts
                const response = await api.get('/contacts');
                setContacts(response.data.data || response.data || []);
            } catch (err) {
                console.error("Failed to load contacts for calling", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchContacts();
    }, []);

    const handlePlaceCall = async (contactUser: any, type: 'AUDIO' | 'VIDEO') => {
        const targetId = contactUser.id;
        
        try {
            await callsApi.createCall({
                callerId: Number(user?.id),
                receiverId: Number(targetId),
                startedAt: new Date().toISOString(),
                type
            });
            
            socketEmitters.initiateCall(targetId, type, 0);
            startCall({ user: contactUser, userId: targetId }, type);
            closeModal();
        } catch (err) {
            console.error('Call initialization failed', err);
            alert('Could not start the call');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
            <div className="bg-[#111b21] w-full max-w-md rounded-xl shadow-2xl overflow-hidden flex flex-col h-[500px] border border-[#222e35]">
                {/* Header */}
                <div className="bg-[#202c33] px-4 py-3 flex items-center text-[#d1d7db]">
                    <button onClick={closeModal} className="p-2 -ml-2 mr-2 hover:bg-white/10 rounded-full transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <h2 className="text-[19px] font-medium flex-1">Start a Call</h2>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto no-scrollbar py-2">
                    {isLoading ? (
                        <div className="flex justify-center p-8">
                            <div className="w-8 h-8 border-3 border-t-transparent border-[#00a884] rounded-full animate-spin"></div>
                        </div>
                    ) : contacts.length === 0 ? (
                        <div className="text-center p-8 text-[#aebac1]">
                            <p>No contacts available.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {contacts.map((contactWrapper: any) => {
                                const contactUser = contactWrapper.contact || contactWrapper;
                                if (!contactUser) return null;

                                return (
                                    <div key={contactUser.id} className="flex items-center px-4 py-3 hover:bg-[#202c33] group transition-colors">
                                        <UserAvatar user={contactUser} size="md" />
                                        <div className="ml-4 flex-1 min-w-0">
                                            <h3 className="text-[#d1d7db] text-[17px] truncate font-medium">{contactUser.username}</h3>
                                            <p className="text-[#aebac1] text-[13px] truncate">{contactUser.bio || 'Available'}</p>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => handlePlaceCall(contactUser, 'AUDIO')}
                                                className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-[#00a884] transition-colors"
                                                title="Voice call"
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                                            </button>
                                            <button 
                                                onClick={() => handlePlaceCall(contactUser, 'VIDEO')}
                                                className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-[#00a884] transition-colors"
                                                title="Video call"
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
