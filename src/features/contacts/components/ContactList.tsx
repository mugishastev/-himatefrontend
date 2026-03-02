import React, { useEffect } from 'react';
import { useUserStore } from '../../../store/user.store';
import { useUIStore } from '../../../store/ui.store';
import { useAuthStore } from '../../../store/auth.store'; // Added this import
import { contactsApi } from '../../../api/contacts.api';
import { ContactItem } from './ContactItem';

export const ContactList: React.FC = () => {
    const { user } = useAuthStore();
    const { contacts, setContacts, setIsLoading, isLoading } = useUserStore();
    const { openModal } = useUIStore();

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

    if (isLoading) return <div className="p-4 text-center">Loading contacts...</div>;

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-100 w-80 overflow-y-auto">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
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
            <div className="divide-y divide-gray-50">
                {contacts.length === 0 ? (
                    <div className="p-8 text-center text-text-secondary">
                        No contacts yet.
                    </div>
                ) : (
                    contacts.map((contact) => (
                        <ContactItem key={contact.id} contact={contact} />
                    ))
                )}
            </div>
        </div>
    );
};
