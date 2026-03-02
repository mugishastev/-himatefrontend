import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <div className={`bg-bg-primary border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}>
            {children}
        </div>
    );
};
