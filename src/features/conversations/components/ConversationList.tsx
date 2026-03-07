import React, { useEffect, useMemo, useState } from 'react';
import { ConversationItem } from './ConversationItem';
import { useConversations } from '../../../hooks/useConversations';
import { useUIStore } from '../../../store/ui.store';

export const ConversationList: React.FC = () => {
    const { conversations, fetchConversations, isLoading } = useConversations();
    const { isSidebarOpen, openModal } = useUIStore();
    const [query, setQuery] = useState('');

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    const filteredConversations = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        return conversations.filter((conversation) => {
            const participants = conversation.participants || [];
            const title = conversation.title || participants.map((p) => p.user?.username).join(', ');
            if (normalizedQuery && !title.toLowerCase().includes(normalizedQuery)) return false;
            return true;
        });
    }, [conversations, query]);

    if (!isSidebarOpen) return null;

    return (
        <div className="flex flex-col h-full bg-white border-r border-[#d1d7db] w-full overflow-hidden">
            {/* WhatsApp Header for Conversation List */}
            <header className="h-[60px] bg-[#f0f2f5] border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
                <div className="w-10 h-10 rounded-full overflow-hidden cursor-pointer">
                    {/* User profile view trigger could go here */}
                    <div className="w-full h-full bg-gray-300"></div>
                </div>
                <div className="flex items-center gap-2 text-[#54656f]">
                    <button className="p-2 hover:bg-black/5 rounded-full transition-colors" title="Communities">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" /></svg>
                    </button>
                    <button className="p-2 hover:bg-black/5 rounded-full transition-colors" onClick={() => (window as any).setView?.('STATUS')} title="Status">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2V7h2v10z" /></svg>
                    </button>
                    <button className="p-2 hover:bg-black/5 rounded-full transition-colors" onClick={() => openModal('NEW_CONVERSATION')} title="New chat">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.05 4.91a9.96 9.96 0 0 0-14.1 0 9.96 9.96 0 0 0 0 14.1c3.9 3.9 10.2 3.9 14.1 0a9.96 9.96 0 0 0 0-14.1zm-1.41 12.69a7.97 7.97 0 0 1-11.28 0 7.97 7.97 0 0 1 0-11.28 7.97 7.97 0 0 1 11.28 0 7.97 7.97 0 0 1 0 11.28zm-4.64-8.64h-2v2h-2v2h2v2h2v-2h2v-2h-2v-2z" /></svg>
                    </button>
                    <button className="p-2 hover:bg-black/5 rounded-full transition-colors" title="Menu">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 4.001A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 4.001A2 2 0 0 0 12 15z" /></svg>
                    </button>
                </div>
            </header>

            {/* Notification Banner */}
            <div className="bg-[#53bdeb] p-4 flex items-center gap-4 cursor-pointer hover:bg-[#47a8d8] transition-colors shrink-0">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#53bdeb]">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22a2.01 2.01 0 0 0 2-2h-4a2.01 2.01 0 0 0 2 2zm8-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C9.64 5.36 8 7.92 8 11v5l-2 2v1h16v-1l-2-2z" /></svg>
                </div>
                <div className="text-white">
                    <h4 className="text-lg leading-tight">Get Notified of New Messages</h4>
                    <p className="text-sm border-b border-transparent hover:border-white inline-block">Turn on desktop notifications</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="p-2 bg-white flex items-center gap-2 shrink-0 h-[49px]">
                <div className="flex-1 relative bg-[#f0f2f5] rounded-lg">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search or start new chat"
                        className="w-full bg-transparent pl-12 pr-4 py-1.5 text-sm outline-none placeholder:text-[#667781]"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667781]">
                        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M15.07 14.25h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0a4.75 4.75 0 1 1 0-9.5 4.75 4.75 0 0 1 0 9.5z" /></svg>
                    </div>
                </div>
                <button className="text-[#667781] p-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
                </button>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto no-scrollbar bg-white">
                {isLoading ? (
                    <div className="p-4 text-center text-text-secondary italic">Loading chats...</div>
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
