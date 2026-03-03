import React, { useEffect, useMemo, useState } from 'react';
import { useUserStore } from '../../../store/user.store';
import { useUIStore } from '../../../store/ui.store';
import { useAuthStore } from '../../../store/auth.store'; // Added this import
import { contactsApi } from '../../../api/contacts.api';
import { ContactItem } from './ContactItem';
import { Modal } from '../../../components/ui/Modal';
import type { User } from '../../../types/user.types';
import { UserAvatar } from '../../users/components/UserAvatar';

export const ContactList: React.FC = () => {
    const { user } = useAuthStore();
    const { contacts, setContacts, setIsLoading, isLoading } = useUserStore();
    const { openModal } = useUIStore();
    const [query, setQuery] = useState('');
    const [selectedContact, setSelectedContact] = useState<User | null>(null);

    useEffect(() => {
        const fetchContacts = async () => {
            if (!user?.id) return;
            setIsLoading(true);
            try {
                // If the backend requires userId, use contactsApi.getUserContacts(user.id)
                // Otherwise use the generic getContacts()
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
            (c.username || '').toLowerCase().includes(q) ||
            (c.email || '').toLowerCase().includes(q)
        );
    }, [contacts, query]);

    if (isLoading) return <div className="p-4 text-center">Loading contacts...</div>;

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-100 w-80 overflow-y-auto">
            <div className="p-4 border-b border-gray-100 space-y-3">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-text-primary">Contacts</h2>
                    <button
                        type="button"
                        onClick={() => openModal('ADD_CONTACT')}
                        className="p-2 hover:bg-bg-secondary rounded-full text-brand transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </button>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search contacts"
                        className="w-full bg-bg-secondary border border-gray-100 rounded-xl pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand/20"
                    />
                    <svg className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M16.2 10.6a5.6 5.6 0 11-11.2 0 5.6 5.6 0 0111.2 0z" />
                    </svg>
                </div>
            </div>
            <div className="divide-y divide-gray-50">
                {filteredContacts.length === 0 ? (
                    <div className="p-8 text-center text-text-secondary">
                        No contacts found.
                    </div>
                ) : (
                    filteredContacts.map((contact) => (
                        <ContactItem key={contact.id} contact={contact} onOpenProfile={setSelectedContact} />
                    ))
                )}
            </div>

            <Modal
                isOpen={!!selectedContact}
                onClose={() => setSelectedContact(null)}
                title="Contact Profile"
            >
                {selectedContact && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <UserAvatar user={selectedContact} size="md" />
                            <div>
                                <p className="font-bold text-text-primary">{selectedContact.username}</p>
                                <p className="text-xs text-text-secondary">{selectedContact.email}</p>
                            </div>
                        </div>
                        <div className="text-sm text-text-secondary">
                            <p><span className="font-semibold text-text-primary">Bio:</span> {selectedContact.bio || 'No bio yet.'}</p>
                            <p className="mt-1"><span className="font-semibold text-text-primary">Status:</span> {selectedContact.status || 'Offline'}</p>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
