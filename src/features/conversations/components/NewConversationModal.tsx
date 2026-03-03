import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useConversations } from '../../../hooks/useConversations';
import { usersApi } from '../../../api/users.api';
import { UserAvatar } from '../../users/components/UserAvatar';
import type { User } from '../../../types/user.types';

interface NewConversationModalProps {
    onClose: () => void;
}

export const NewConversationModal: React.FC<NewConversationModalProps> = ({ onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const { createConversation, isLoading: isCreating } = useConversations();

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
        console.log('Button Clicked: Starting chat with userId:', userId);
        await createConversation([userId]);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <Card className="w-full max-w-lg p-0 overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                    <div>
                        <h2 className="text-2xl font-black text-text-primary tracking-tight">New Chat</h2>
                        <p className="text-sm text-text-secondary">Search for people to start a conversation</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-bg-secondary rounded-full text-text-secondary transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <Input
                            placeholder="Type a username or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 py-3 bg-bg-secondary border-none focus:ring-2 focus:ring-brand/20 transition-all text-lg"
                        />
                    </div>

                    <div className="max-h-[400px] overflow-y-auto space-y-2 py-2">
                        {isSearching ? (
                            <div className="py-12 text-center text-text-secondary">
                                <div className="animate-spin w-8 h-8 border-4 border-brand border-t-transparent rounded-full mx-auto mb-4"></div>
                                <p className="font-medium">Searching for users...</p>
                            </div>
                        ) : searchResults.length === 0 ? (
                            <div className="py-12 text-center text-text-secondary">
                                <div className="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <p className="font-medium">{searchQuery ? 'No users found' : 'Type to search users'}</p>
                            </div>
                        ) : (
                            searchResults.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-brand/5 border border-transparent hover:border-brand/10 transition-all group"
                                >
                                    <div className="flex items-center space-x-4">
                                        <UserAvatar user={user} size="md" />
                                        <div>
                                            <p className="font-bold text-text-primary">{user.username}</p>
                                            <p className="text-sm text-text-secondary">{user.email}</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="opacity-0 group-hover:opacity-100 transition-all py-1.5 px-4 rounded-xl font-bold text-brand hover:bg-brand hover:text-white border-brand/50"
                                        onClick={() => handleStartChat(user.id)}
                                        isLoading={isCreating}
                                    >
                                        Chat
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="p-4 bg-bg-secondary/50 border-t border-gray-100 flex justify-end">
                    <Button variant="outline" onClick={onClose} className="border-none hover:bg-bg-secondary font-bold text-text-secondary">
                        Close
                    </Button>
                </div>
            </Card>
        </div>
    );
};
