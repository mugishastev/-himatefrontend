import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useConversations } from '../../../hooks/useConversations';
import { usersApi } from '../../../api/users.api';
import { UserAvatar } from '../../users/components/UserAvatar';
import type { User } from '../../../types/user.types';

interface CreateGroupModalProps {
    onClose: () => void;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ onClose }) => {
    const [groupName, setGroupName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const { createConversation, isLoading: isCreating } = useConversations();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.trim()) {
                handleSearch();
            } else {
                setSearchResults([]);
            }
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
            const users = response.data || (Array.isArray(response) ? response : []);
            // Filter out already selected users
            setSearchResults(users.filter((u: User) => !selectedUsers.find((su: User) => su.id === u.id)));
        } catch (error) {
            console.error('Failed to search users', error);
        } finally {
            setIsSearching(false);
        }
    };

    const toggleUser = (user: User) => {
        if (selectedUsers.find((u: User) => u.id === user.id)) {
            setSelectedUsers(selectedUsers.filter((u: User) => u.id !== user.id));
        } else {
            setSelectedUsers([...selectedUsers, user]);
            setSearchResults(searchResults.filter((u: User) => u.id !== user.id));
            setSearchQuery('');
        }
    };

    const handleCreateGroup = async () => {
        if (!groupName.trim() || selectedUsers.length === 0) return;

        try {
            await createConversation(selectedUsers.map((u: User) => u.id), groupName);
            onClose();
        } catch (error) {
            console.error('Failed to create group', error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <Card className="w-full max-w-lg p-0 overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                    <div>
                        <h2 className="text-2xl font-black text-text-primary tracking-tight">Create Group</h2>
                        <p className="text-sm text-text-secondary">Add participants and give it a name</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-bg-secondary rounded-full text-text-secondary transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Group Name</label>
                        <Input
                            placeholder="Enter group name..."
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            className="py-3 bg-bg-secondary border-none focus:ring-2 focus:ring-brand/20 transition-all font-bold"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Selected Participants ({selectedUsers.length})</label>
                        <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-bg-secondary rounded-xl">
                            {selectedUsers.length === 0 && <span className="text-sm text-text-muted italic p-1">No participants added yet</span>}
                            {selectedUsers.map(user => (
                                <div key={user.id} className="flex items-center gap-1 bg-brand text-white px-2 py-1 rounded-lg text-sm font-bold animate-in zoom-in duration-200">
                                    <span>{user.username}</span>
                                    <button onClick={() => toggleUser(user)} className="hover:text-black/50 transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Search Participants</label>
                        <Input
                            placeholder="Type a username..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 py-3 bg-bg-secondary border-none focus:ring-2 focus:ring-brand/20 transition-all"
                        />
                        <svg className="w-5 h-5 text-text-secondary absolute left-3 bottom-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <div className="max-h-[200px] overflow-y-auto space-y-1">
                        {isSearching ? (
                            <div className="py-4 text-center text-text-secondary italic text-sm">Searching...</div>
                        ) : searchResults.map(user => (
                            <button
                                key={user.id}
                                onClick={() => toggleUser(user)}
                                className="w-full flex items-center space-x-3 p-2 rounded-xl hover:bg-bg-secondary transition-colors text-left"
                            >
                                <UserAvatar user={user} size="sm" />
                                <div>
                                    <p className="font-bold text-sm text-text-primary">{user.username}</p>
                                    <p className="text-xs text-text-muted">{user.email}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-4 bg-bg-secondary/50 border-t border-gray-100 flex justify-between items-center">
                    <Button variant="outline" onClick={onClose} className="border-none hover:bg-bg-secondary font-bold text-text-secondary">
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleCreateGroup}
                        disabled={!groupName.trim() || selectedUsers.length === 0}
                        isLoading={isCreating}
                        className="rounded-xl px-8 font-bold"
                    >
                        Create Group
                    </Button>
                </div>
            </Card>
        </div>
    );
};
