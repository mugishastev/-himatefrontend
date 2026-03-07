import React, { useEffect, useMemo, useState } from 'react';
import { useUserStore } from '../../../store/user.store';
import { useUIStore } from '../../../store/ui.store';
import { useAuthStore } from '../../../store/auth.store';
import { contactsApi } from '../../../api/contacts.api';
import { conversationsApi } from '../../../api/conversations.api';
import { useConversationStore } from '../../../store/conversation.store';
import { ContactItem } from './ContactItem';
import { Modal } from '../../../components/ui/Modal';
import type { User } from '../../../types/user.types';
import { UserAvatar } from '../../users/components/UserAvatar';

export const ContactList: React.FC = () => {
    const { user } = useAuthStore();
    const { contacts, setContacts, setIsLoading, isLoading, removeContact } = useUserStore();
    const { openModal, setView } = useUIStore();
    const { setActiveConversation, addConversation } = useConversationStore();
    const [query, setQuery] = useState('');
    const [selectedContact, setSelectedContact] = useState<User | null>(null);
    const [messaging, setMessaging] = useState(false);

    useEffect(() => {
        const fetchContacts = async () => {
            if (!user?.id) return;
            setIsLoading(true);
            try {
                const response = await contactsApi.getContacts();
                setContacts(response.data || response);
            } catch (error) {
                console.error('Failed to fetch contacts', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchContacts();
    }, [setContacts, setIsLoading, user?.id]);

    const filteredContacts = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return contacts;
        return contacts.filter((c) =>
            (c.username || '').toLowerCase().includes(q)
        );
    }, [contacts, query]);

    const handleMessage = async () => {
        if (!selectedContact || !user?.id || messaging) return;
        setMessaging(true);
        try {
            const conv = await conversationsApi.createConversation({
                userIds: [Number(selectedContact.id)],
                isGroup: false,
            });
            addConversation(conv);
            setActiveConversation(conv.id);
            setSelectedContact(null);
            setView('CHATS');
        } catch (err) {
            console.error('Failed to open DM:', err);
            alert('Could not open a conversation. Please try again.');
        } finally {
            setMessaging(false);
        }
    };

    const handleRemoveContact = async () => {
        if (!selectedContact) return;
        if (!confirm(`Remove ${selectedContact.username} from contacts?`)) return;
        try {
            await contactsApi.deleteContact(Number(selectedContact.id));
            removeContact(Number(selectedContact.id));
            setSelectedContact(null);
        } catch (err) {
            console.error('Failed to remove contact:', err);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#f0f2f5] animate-in fade-in duration-300">
            {/* Header */}
            <header className="h-[108px] bg-brand flex items-end px-8 pb-4 shrink-0 text-white shadow-md z-10">
                <div className="flex justify-between items-center w-full max-w-5xl mx-auto">
                    <div>
                        <h1 className="text-[22px] font-semibold tracking-wide">Contacts</h1>
                        <p className="text-sm text-white/80 mt-1">{contacts.length} saved connections</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => openModal('ADD_CONTACT')}
                        className="flex items-center gap-2 bg-white text-brand px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors shadow-sm"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Add New</span>
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto no-scrollbar py-8 px-4 md:px-8">
                <div className="max-w-5xl mx-auto space-y-6">

                    {/* Search Bar */}
                    <div className="bg-white rounded-2xl shadow-sm p-4 sticky top-0 z-10 border border-gray-100/50">
                        <div className="relative">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search contacts by username..."
                                className="w-full bg-[#f0f2f5] border-transparent rounded-xl pl-12 pr-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-brand/30 transition-shadow"
                            />
                            <svg className="w-5 h-5 text-[#667781] absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-4.35-4.35M16.2 10.6a5.6 5.6 0 11-11.2 0 5.6 5.6 0 0111.2 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Contacts Grid */}
                    {isLoading ? (
                        <div className="p-12 text-center text-[#667781]">Loading your contacts...</div>
                    ) : filteredContacts.length === 0 ? (
                        <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100/50">
                            <div className="w-20 h-20 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            </div>
                            <h3 className="text-xl font-semibold text-[#111b21] mb-2">{query ? 'No matching contacts' : 'No contacts yet'}</h3>
                            <p className="text-[#667781]">
                                {query ? "We couldn't find anyone matching your search." : "Start building your network by adding a new contact."}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredContacts.map((contact) => (
                                <ContactItem key={contact.id} contact={contact} onOpenProfile={setSelectedContact} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Existing Contact Detail Modal */}
            <Modal
                isOpen={!!selectedContact}
                onClose={() => setSelectedContact(null)}
                title="Contact Info"
            >
                {selectedContact && (
                    <div className="space-y-6 px-2">
                        <div className="flex flex-col items-center gap-3 py-4 border-b border-gray-100">
                            <div className="w-24 h-24 rounded-full overflow-hidden shadow-sm">
                                <UserAvatar user={selectedContact} size="full" />
                            </div>
                            <div className="text-center">
                                <p className="text-xl font-bold text-[#111b21]">{selectedContact.username}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <p className="text-xs font-semibold text-[#667781] uppercase tracking-wider mb-1">About</p>
                                <p className="text-[15px] text-[#111b21]">{selectedContact.bio || 'Hey there! I am using Himate.'}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <p className="text-xs font-semibold text-[#667781] uppercase tracking-wider mb-1">Current Status</p>
                                <p className="text-[15px] text-[#111b21] flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 block"></span>
                                    {selectedContact.status || 'Active'}
                                </p>
                            </div>
                        </div>
                        <div className="pt-4 flex gap-3">
                            <button
                                onClick={handleMessage}
                                disabled={messaging}
                                className="flex-1 bg-[#F97316] hover:bg-[#EA6C0A] text-white py-2.5 rounded-xl font-medium transition-colors shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                {messaging ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                        Opening...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                        Message
                                    </>
                                )}
                            </button>
                            <button
                                onClick={handleRemoveContact}
                                className="flex-1 bg-[#1F2937] text-slate-300 py-2.5 rounded-xl font-medium hover:bg-red-500/10 hover:text-red-400 transition-colors"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
