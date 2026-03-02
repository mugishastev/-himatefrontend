import React from 'react';

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon, action }) => {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-brand/5 rounded-full flex items-center justify-center text-brand mb-6">
                {icon || (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0l-8 8-8-8" />
                    </svg>
                )}
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">{title}</h2>
            <p className="text-text-secondary max-w-sm mb-8 leading-relaxed">
                {description}
            </p>
            {action}
        </div>
    );
};
