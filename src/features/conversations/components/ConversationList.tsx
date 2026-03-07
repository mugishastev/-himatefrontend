import React, { useEffect, useMemo, useState, useRef } from "react";
import { ConversationItem } from "./ConversationItem";
import { useConversations } from "../../../hooks/useConversations";
import { useUIStore } from "../../../store/ui.store";

export const ConversationList: React.FC = () => {
    const { conversations, fetchConversations, isLoading } = useConversations();
    const { isSidebarOpen, openModal } = useUIStore();
    const [query, setQuery] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredConversations = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        return conversations.filter((conversation) => {
            const participants = conversation.participants || [];
            const title =
                conversation.title ||
                participants.map((p) => p.user?.username).join(", ");
            if (normalizedQuery && !title.toLowerCase().includes(normalizedQuery))
                return false;
            return true;
        });
    }, [conversations, query]);

    if (!isSidebarOpen) return null;

    return (
        <div className="flex flex-col h-full bg-[#111827] border-r border-[#1F2937] w-full overflow-hidden text-[#d1d7db]">
            {/* Chats Header */}
            <header className="h-[60px] flex items-center justify-between px-4 shrink-0 mt-2">
                <h1 className="text-[22px] font-bold text-white">Chats</h1>

                <div className="flex items-center gap-3 text-[#aebac1]">
                    <button
                        className="p-2 hover:bg-white/5 rounded-full transition-colors group"
                        onClick={() => openModal("NEW_CONVERSATION")}
                        title="New chat"
                    >
                        <svg className="w-5 h-5 text-[#aebac1] group-hover:text-[#d1d7db]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19.05 4.91a9.96 9.96 0 0 0-14.1 0 9.96 9.96 0 0 0 0 14.1c3.9 3.9 10.2 3.9 14.1 0a9.96 9.96 0 0 0 0-14.1zm-1.41 12.69a7.97 7.97 0 0 1-11.28 0 7.97 7.97 0 0 1 0-11.28 7.97 7.97 0 0 1 11.28 0 7.97 7.97 0 0 1 0 11.28zm-4.64-8.64h-2v2h-2v2h2v2h2v-2h2v-2h-2v-2z" />
                        </svg>
                    </button>
                    <div className="relative" ref={menuRef}>
                        <button
                            className={`p-2 rounded-full transition-colors group ${isMenuOpen ? "bg-[#1F2937]" : "hover:bg-white/5"}`}
                            title="Menu"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <svg className="w-5 h-5 text-[#aebac1] group-hover:text-[#d1d7db]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 4.001A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 4.001A2 2 0 0 0 12 15z" />
                            </svg>
                        </button>
                        {isMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-[#202c33] rounded-lg shadow-xl border border-[#313d45] py-2 z-50">
                                <button
                                    className="w-full text-left px-4 py-2 text-[#d1d7db] hover:bg-[#111827] transition-colors text-[14px]"
                                    onClick={() => {
                                        openModal("CREATE_GROUP");
                                        setIsMenuOpen(false);
                                    }}
                                >
                                    New group
                                </button>
                                <button
                                    className="w-full text-left px-4 py-2 text-[#d1d7db] hover:bg-[#111827] transition-colors text-[14px]"
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                    }}
                                >
                                    Starred messages
                                </button>
                                <button
                                    className="w-full text-left px-4 py-2 text-[#d1d7db] hover:bg-[#111827] transition-colors text-[14px]"
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                    }}
                                >
                                    Select chats
                                </button>
                                <button
                                    className="w-full text-left px-4 py-2 text-[#d1d7db] hover:bg-[#111827] transition-colors text-[14px]"
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                    }}
                                >
                                    Mark all as read
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Search Bar */}
            <div className="px-3 py-2 flex items-center gap-2 shrink-0">
                <div className="flex-1 relative bg-[#1F2937] rounded-lg h-9">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search or start a new chat"
                        className="w-full h-full bg-transparent pl-12 pr-4 text-[14px] text-white outline-none placeholder:text-[#aebac1]"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#aebac1]">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Filter Chips */}
            <div className="flex px-3 pb-3 gap-2 overflow-x-auto no-scrollbar shrink-0 border-b border-[#1F2937]">
                <button className="px-4 py-1.5 rounded-full bg-[#1F2937] hover:bg-[#374248] text-[#d1d7db] text-[14px] font-medium transition-colors">
                    All
                </button>
                <button className="px-4 py-1.5 rounded-full bg-[#1F2937] hover:bg-[#374248] text-[#d1d7db] text-[14px] font-medium transition-colors">
                    Unread <span className="text-[#00a884] ml-1">1</span>
                </button>
                <button className="px-4 py-1.5 rounded-full bg-[#1F2937] hover:bg-[#374248] text-[#d1d7db] text-[14px] font-medium transition-colors">
                    Favorites
                </button>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto no-scrollbar bg-[#111827]">
                {isLoading ? (
                    <div className="p-4 text-center text-text-secondary italic">
                        Loading chats...
                    </div>
                ) : filteredConversations.length === 0 ? (
                    <div className="p-8 text-center text-text-secondary">
                        No conversations found.
                    </div>
                ) : (
                    filteredConversations.map((conversation) => (
                        <ConversationItem
                            key={conversation.id}
                            conversation={conversation}
                        />
                    ))
                )}
            </div>
        </div>
    );
};
