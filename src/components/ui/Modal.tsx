import React, { useEffect } from 'react';
import { Card } from './Card';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
            <Card className="w-full max-w-md p-6 space-y-6 relative border-none shadow-2xl">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-text-primary">{title}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-bg-secondary rounded-full transition-colors text-text-muted hover:text-text-primary">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div>{children}</div>
            </Card>
        </div>
    );
};
