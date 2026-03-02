import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', className = '' }) => {
    const variants = {
        primary: 'bg-brand/10 text-brand',
        secondary: 'bg-gray-100 text-gray-600',
        success: 'bg-green-100 text-green-600',
        error: 'bg-red-100 text-red-600',
        warning: 'bg-yellow-100 text-yellow-600',
    };

    return (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};
