import React, { useEffect, useMemo, useState } from 'react';
import { ConversationItem } from './ConversationItem';
import { useConversations } from '../../../hooks/useConversations';
import { useUIStore } from '../../../store/ui.store';

export const ConversationList: React.FC = () => {
    const { conversations, fetchConversations, isLoading } = useConversations();
    const { isSidebarOpen, openModal } = useUIStore();
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'GROUPS'>('ALL');

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    const filteredConversations = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        return conversations.filter((conversation) => {
            const participants = conversation.participants || [];
            const title = conversation.title || participants.map((p) => p.user?.username).join(' ');
            const isUnread = (conversation.unreadCount || 0) > 0;

            if (filter === 'UNREAD' && !isUnread) return false;
            if (filter === 'GROUPS' && !conversation.isGroup) return false;
            if (normalizedQuery && !title.toLowerCase().includes(normalizedQuery)) return false;
            return true;
        });
    }, [conversations, filter, query]);

    if (!isSidebarOpen) return null;

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-100 w-84 overflow-y-auto">
            <div className="p-4 border-b border-gray-100 space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-black text-text-primary tracking-tight">Messages</h2>
                    <button
                        type="button"
                        onClick={() => openModal('NEW_CONVERSATION')}
                        className="p-2 hover:bg-bg-secondary rounded-full text-brand transition-colors"
                        title="Start new chat"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>

                <div className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search chats"
                        className="w-full bg-bg-secondary border border-gray-100 rounded-xl pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand/20"
                    />
                    <svg className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M16.2 10.6a5.6 5.6 0 11-11.2 0 5.6 5.6 0 0111.2 0z" />
                    </svg>
                </div>

                <div className="flex gap-2">
                    {[
                        { id: 'ALL', label: 'All' },
                        { id: 'UNREAD', label: 'Unread' },
                        { id: 'GROUPS', label: 'Groups' },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setFilter(item.id as 'ALL' | 'UNREAD' | 'GROUPS')}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${filter === item.id ? 'bg-brand text-white' : 'bg-bg-secondary text-text-secondary hover:text-brand'}`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1">
                {isLoading ? (
                    <div className="p-4 text-center text-text-secondary">Loading...</div>
                ) : filteredConversations.length === 0 ? (
                    <div className="p-8 text-center text-text-secondary">
                        No conversations found.
                    </div>
                ) : (
                    filteredConversations.map((conversation) => (
                        <ConversationItem key={conversation.id} conversation={conversation} />
                    ))
                )}
            </div>
        </div>
    );
};
