import React from 'react';
import { ContactList } from '../components/ContactList';

export const ContactsPage: React.FC = () => {
    return (
        <div className="h-full flex flex-col bg-white">
            <ContactList />
        </div>
    );
};

export default ContactsPage;
