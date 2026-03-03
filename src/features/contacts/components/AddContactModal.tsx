import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { contactsApi } from '../../../api/contacts.api';
import { usersApi } from '../../../api/users.api';
import { useAuthStore } from '../../../store/auth.store';

interface AddContactModalProps {
    onClose: () => void;
    onSuccess?: () => void;
}

export const AddContactModal: React.FC<AddContactModalProps> = ({ onClose, onSuccess }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !user) return;

        setIsLoading(true);
        setError(null);
        try {
            // 1. Search for user by email
            const searchResponse = await usersApi.findAll({ search: email.trim() });
            const foundUser = searchResponse.data.find((u: any) => u.email.toLowerCase() === email.trim().toLowerCase());

            if (!foundUser) {
                throw new Error('User not found with this email');
            }

            if (Number(foundUser.id) === Number(user.id)) {
                throw new Error('You cannot add yourself as a contact');
            }

            // 2. Add contact using both IDs
            await contactsApi.addContact(Number(user.id), Number(foundUser.id));

            onSuccess?.();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to add contact');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
            <Card className="w-full max-w-md p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-text-primary">Add Contact</h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Email Address"
                        placeholder="friend@example.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <div className="flex space-x-3 pt-2">
                        <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
                        <Button variant="primary" className="flex-1" type="submit" isLoading={isLoading}>Add Friend</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
