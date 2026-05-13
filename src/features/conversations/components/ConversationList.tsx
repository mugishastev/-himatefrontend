import React, { useEffect, useMemo, useState, useRef } from "react";
import { PlusCircle, MoreVertical, Search } from "lucide-react";
import { ConversationItem } from "./ConversationItem";
import { useConversations } from "../../../hooks/useConversations";
import { useUIStore } from "../../../store/ui.store";
import { useFavoritesStore } from "../../../store/favorites.store";
import { useConversationStore } from "../../../store/conversation.store";
import { messagesApi } from "../../../api/messages.api";

export const ConversationList: React.FC = () => {
    const { conversations, fetchConversations, isLoading } = useConversations();
    const isSidebarOpen = useUIStore((s) => s.isSidebarOpen);
    const openModal = useUIStore((s) => s.openModal);
    const favoriteConversationIds = useFavoritesStore((s) => s.favoriteConversationIds);
    const setConversations = useConversationStore((s) => s.setConversations);
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState<"ALL" | "UNREAD" | "FAVORITES">("ALL");
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
            // Text Search
            const participants = conversation.participants || [];
            const title =
                conversation.title ||
                participants.map((p) => p.user?.username).join(", ");
            if (normalizedQuery && !title.toLowerCase().includes(normalizedQuery))
                return false;

            // Filter Chips
            if (filter === "UNREAD") {
                if (!conversation.unreadCount || conversation.unreadCount === 0) return false;
            } else if (filter === "FAVORITES") {
                const key = String(conversation.id);
                if (!favoriteConversationIds[key]) return false;
            }

            return true;
        });
    }, [conversations, query, filter, favoriteConversationIds]);

    const globalUnreadCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

    const handleMarkAllAsRead = async () => {
        setIsMenuOpen(false);
        if (!conversations.length) return;

        // Best-effort: clear on backend per conversation, then update local unread counts.
        await Promise.all(
            conversations.map((c) =>
                messagesApi.markConversationAsRead(c.id).catch(() => null)
            )
        );
        setConversations(conversations.map((c) => ({ ...c, unreadCount: 0 })));
    };

    if (!isSidebarOpen) return null;

    return (
        <div className="flex flex-col h-full bg-[#111827] border-r border-[#1F2937] w-full overflow-hidden text-[#d1d7db]">
            {/* Chats Header */}
            <header className="h-[64px] flex items-center justify-between px-4 shrink-0 mt-1 sticky top-0 bg-[#111827] z-20">
                <h1 className="text-[24px] font-black text-white tracking-tight">Chats</h1>

                <div className="flex items-center gap-1 text-[#aebac1]">
                    <button
                        className="p-2 hover:bg-white/5 rounded-full transition-colors group"
                        onClick={() => openModal("NEW_CONVERSATION")}
                        title="New chat"
                    >
                        <PlusCircle className="w-6 h-6 text-[#aebac1] group-hover:text-brand" />
                    </button>
                    <div className="relative" ref={menuRef}>
                        <button
                            className={`p-2 rounded-full transition-colors group ${isMenuOpen ? "bg-[#1F2937]" : "hover:bg-white/5"}`}
                            title="Menu"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <MoreVertical className="w-5 h-5 text-[#aebac1] group-hover:text-[#d1d7db]" />
                        </button>
                        {isMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-[#202c33] rounded-xl shadow-2xl border border-[#313d45] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
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
                                    onClick={handleMarkAllAsRead}
                                >
                                    Mark all as read
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Search Bar */}
            <div className="px-4 py-2 flex items-center gap-2 shrink-0">
                <div className="flex-1 relative bg-[#1F2937] rounded-xl h-10 group transition-all focus-within:ring-2 focus-within:ring-brand/30">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search or start a new chat"
                        className="w-full h-full bg-transparent pl-11 pr-4 text-[14px] text-white outline-none placeholder:text-[#aebac1]"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#aebac1] group-focus-within:text-brand transition-colors">
                        <Search className="w-4 h-4" />
                    </div>
                </div>
            </div>

            {/* Filter Chips */}
            <div className="flex px-3 pb-3 gap-2 overflow-x-auto no-scrollbar shrink-0 border-b border-[#1F2937]">
                <button 
                    onClick={() => setFilter('ALL')}
                    className={`px-4 py-1.5 rounded-full text-[14px] font-medium transition-colors ${filter === 'ALL' ? 'bg-[#374248] text-white' : 'bg-[#1F2937] hover:bg-[#374248] text-[#d1d7db]'}`}
                >
                    All
                </button>
                <button 
                    onClick={() => setFilter('UNREAD')}
                    className={`px-4 py-1.5 rounded-full text-[14px] font-medium transition-colors ${filter === 'UNREAD' ? 'bg-[#374248] text-white' : 'bg-[#1F2937] hover:bg-[#374248] text-[#d1d7db]'}`}
                >
                    Unread {globalUnreadCount > 0 && <span className="text-[#F97316] ml-1">{globalUnreadCount}</span>}
                </button>
                <button 
                    onClick={() => setFilter('FAVORITES')}
                    className={`px-4 py-1.5 rounded-full text-[14px] font-medium transition-colors ${filter === 'FAVORITES' ? 'bg-[#374248] text-white' : 'bg-[#1F2937] hover:bg-[#374248] text-[#d1d7db]'}`}
                >
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
