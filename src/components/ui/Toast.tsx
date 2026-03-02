import React from 'react';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info';
    onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => {
    const variants = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-brand',
    };

    return (
        <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-2xl text-white shadow-xl flex items-center space-x-4 animate-in slide-in-from-right duration-300 ${variants[type]}`}>
            <span className="text-sm font-medium">{message}</span>
            {onClose && (
                <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
};
