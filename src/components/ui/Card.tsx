import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    const hasBg = className.includes('bg-');
    const isLightBg = /\b(bg-white|bg-gray-50|bg-slate-50|bg-slate-100|bg-gray-100)\b/.test(className);
    
    return (
        <div className={`${!hasBg ? 'bg-bg-primary' : ''} ${isLightBg ? 'text-gray-900' : 'text-white'} border border-gray-100/10 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
            {children}
        </div>
    );
};
