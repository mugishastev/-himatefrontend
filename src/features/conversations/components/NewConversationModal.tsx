import React, { useState, useEffect } from 'react';
import { useConversations } from '../../../hooks/useConversations';
import { useUIStore } from '../../../store/ui.store';
import { usersApi } from '../../../api/users.api';
import { UserAvatar } from '../../users/components/UserAvatar';
import { useAuthStore } from '../../../store/auth.store';
import { useConversationStore } from '../../../store/conversation.store';
import type { User } from '../../../types/user.types';

interface NewConversationModalProps {
    onClose: () => void;
}

export const NewConversationModal: React.FC<NewConversationModalProps> = ({ onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const { conversations, createConversation, setActiveConversation, isLoading: isCreating } = useConversations();
    const { openModal } = useUIStore();
    const { user: currentUser } = useAuthStore();
    const { setActiveConversation: storeSetActive } = useConversationStore();

    useEffect(() => {
        const timer = setTimeout(() => {
            handleSearch();
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSearch = async () => {
        setIsSearching(true);
        try {
            const response = await usersApi.findAll({
                search: searchQuery,
                limit: 10
            });
            // Handle both response.data (wrapped) or response (direct array)
            const users = response.data || (Array.isArray(response) ? response : []);
            setSearchResults(users);
        } catch (error) {
            console.error('Failed to search users', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleStartChat = async (userId: string | number) => {
        // Check if there's already a 1:1 conversation with this user
        const existing = conversations.find(conv => {
            if (conv.isGroup) return false;
            const participantIds = conv.participants.map(p => Number(p.userId));
            return (
                participantIds.includes(Number(userId)) &&
                participantIds.includes(Number(currentUser?.id))
            );
        });

        if (existing) {
            // Already have a conversation — just navigate to it
            storeSetActive(existing.id);
            onClose();
            return;
        }

        // No existing conversation — create a new one
        await createConversation([userId]);
        onClose();
    };

    return (
        <div className="fixed inset-y-0 left-[60px] lg:left-[64px] z-50 w-full sm:w-[380px] bg-[#111827] flex flex-col shadow-2xl border-r border-[#1F2937] animate-in slide-in-from-left duration-200">
            {/* Header */}
            <div className="h-[108px] bg-[#111827] flex items-end px-5 pb-4 shrink-0 text-white">
                <div className="flex items-center gap-6 w-full translate-y-2">
                    <button onClick={onClose} className="p-1 hover:bg-[#1F2937] rounded-full transition-colors shrink-0 -ml-1">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <h2 className="text-[19px] font-medium leading-normal">New chat</h2>
                </div>
            </div>

            {/* Search */}
            <div className="px-3 py-2 border-b border-[#1F2937]/50 shadow-sm shrink-0 bg-[#111827]">
                <div className="relative bg-[#1F2937] rounded-lg h-9 flex items-center">
                    <div className="absolute left-4 text-[#aebac1]">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        placeholder="Search name or number"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent pl-12 pr-4 text-[14px] text-white outline-none placeholder:text-[#aebac1]"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-4 block text-[#d1d7db]">
                {!searchQuery && (
                    <div className="py-2">
                        <button
                            onClick={() => {
                                onClose();
                                openModal('CREATE_GROUP');
                            }}
                            className="w-full flex items-center px-4 py-3 hover:bg-[#1F2937]/50 transition-colors group cursor-pointer"
                        >
                            <div className="w-12 h-12 rounded-full bg-[#00a884] text-white flex items-center justify-center shrink-0">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M13 13h-2v2h2v-2zm-1-8a4 4 0 00-4 4h2a2 2 0 014 0v2h2a4 4 0 00-4-6zm-4 6H7v-2h1v2zm9-3v3h3v2h-3v3h-2v-3h-3v-2h3V8h2zm-3-1l-1 1-1-1v1l1 1 1-1V7zm-6-2C6.48 5 2 9.48 2 15h2c0-4.42 3.58-8 8-8v-2z" />
                                    {/* Roughly drawing people icon */}
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zM4 21c0-2.21 1.79-4 4-4h8c2.21 0 4 1.79 4 4v1H4v-1zm2-2c.6-.9 2-1.5 3.5-1.5h5c1.5 0 2.9.6 3.5 1.5H6z" />
                                </svg>
                            </div>
                            <div className="ml-4 flex-1 text-left border-b border-[#1F2937]/0 group-hover:border-transparent py-3">
                                <p className="text-[17px] text-white">New group</p>
                            </div>
                        </button>

                        <button className="w-full flex items-center px-4 py-3 hover:bg-[#1F2937]/50 transition-colors group cursor-pointer">
                            <div className="w-12 h-12 rounded-full bg-[#00a884] text-white flex items-center justify-center shrink-0">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                            </div>
                            <div className="ml-4 flex-1 text-left border-b border-[#1F2937]/0 group-hover:border-transparent py-3">
                                <p className="text-[17px] text-white">New contact</p>
                            </div>
                        </button>

                        <button className="w-full flex items-center px-4 py-3 hover:bg-[#1F2937]/50 transition-colors group cursor-pointer">
                            <div className="w-12 h-12 rounded-full bg-[#00a884] text-white flex items-center justify-center shrink-0">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                                </svg>
                            </div>
                            <div className="ml-4 flex-1 text-left border-b border-[#1F2937]/0 group-hover:border-transparent py-3">
                                <p className="text-[17px] text-white">New community</p>
                            </div>
                        </button>
                    </div>
                )}

                <div className="pt-2">
                    <h3 className="text-[#00a884] text-[15px] px-8 py-4 uppercase font-medium tracking-wide">
                        {searchQuery ? 'Search Results' : 'Contacts on Himate'}
                    </h3>

                    {isSearching ? (
                        <div className="py-8 text-center text-[#aebac1]">
                            <div className="animate-spin w-6 h-6 border-2 border-[#00a884] border-t-transparent rounded-full mx-auto mb-4"></div>
                        </div>
                    ) : searchResults.length === 0 ? (
                        <div className="py-8 text-center text-[#aebac1] px-4">
                            <p className="text-[14px]">{searchQuery ? 'No results found for ' + searchQuery : 'Search to find users'}</p>
                        </div>
                    ) : (
                        searchResults.map((user) => (
                            <div
                                key={user.id}
                                onClick={() => handleStartChat(user.id)}
                                className="flex items-center px-4 py-2 hover:bg-[#1F2937]/50 transition-colors group cursor-pointer"
                            >
                                <div className="shrink-0">
                                    <UserAvatar user={user} size="lg" />
                                </div>
                                <div className="ml-4 border-b border-[#1F2937]/50 group-hover:border-transparent flex-1 py-3 flex justify-between items-center">
                                    <div>
                                        <p className="text-[17px] text-white font-normal">{user.username}</p>
                                        <p className="text-[14px] text-[#aebac1] truncate mt-1">Hey there! I am using Himate.</p>
                                    </div>
                                    {isCreating && <div className="animate-spin w-4 h-4 border-2 border-[#00a884] border-t-transparent rounded-full"></div>}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
